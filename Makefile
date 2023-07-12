SHELL=/bin/bash -o pipefail

# MAKEFILE ENV
MF_VER?=0.2.3:react-docker

# CI ENV
CI_COMMIT_SHA?=local
CI_COMMIT_REF_NAME?=local
CI_COMMIT_REF_SLUG?=local
CI_COMMIT_TAG?=local
GITLAB_USER_LOGIN?=username
GITLAB_USER_EMAIL?=email
CI_PROJECT_NAME?=kassa
CI_PROJECT_DIR?=.
CI_DEBUG_TRACE?=false

# CI REGISTRY
CI_REGISTRY?=gitlab.softpark.kz:5050
CI_REGISTRY_USER?=login
CI_REGISTRY_PASSWORD?=pass
CI_REGISTRY_IMAGE?=kassa

# PROJECT ENV
TARGET_DIR_ON_HOST?=$(shell pwd)/run
VERSION=$(shell git describe --exact-match --tags 2> /dev/null || git rev-parse --short HEAD)
RSYNC_EXCLUDE_JSON?={'*.log','.env.yml','.env.json','.env','*.sqlite','storage/'}
RSYNC_BACKUP_DIR?=${TARGET_DIR_ON_HOST}/backup/${CI_PROJECT_NAME}

# MISC
DATE=$(shell date +%FT%T%z)

ifeq ($(CI_COMMIT_TAG), local)
    export CI_REGISTRY_IMAGE_VERSION=$(CI_COMMIT_REF_SLUG)
else
	export CI_REGISTRY_IMAGE_VERSION=$(CI_COMMIT_TAG)
endif

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ${CI_REGISTRY_IMAGE}

.DEFAULT_GOAL := help

### BUILD

.PHONY: variables
variables: ## Show variables info
	@echo "[info]   variables ...";
	@echo "==========";
	@id; pwd;
	@echo "==========";
	@ls -la | head -n 100;
	@echo "==========";
	@echo "MAKE_FILE_VER = [ "${MF_VER}" ]";
	@echo "HOME = [ "${HOME}" ]";
	@echo "SHELL = [ "${SHELL}" ]";
	@echo "PATH = [ "${PATH}" ]";
	@echo "CI_COMMIT_SHA = [ "${CI_COMMIT_SHA}" ]";
	@echo "CI_COMMIT_REF_NAME = [ "${CI_COMMIT_REF_NAME}" ]";
	@echo "CI_COMMIT_REF_SLUG = [ "${CI_COMMIT_REF_SLUG}" ]";
	@echo "CI_COMMIT_TAG = [ "${CI_COMMIT_TAG}" ]";
	@echo "CI_REGISTRY_IMAGE_VERSION = [ "${CI_REGISTRY_IMAGE_VERSION}" ]";
	@echo "GITLAB_USER_LOGIN = [ "${GITLAB_USER_LOGIN}" ]";
	@echo "GITLAB_USER_EMAIL = [ "${GITLAB_USER_EMAIL}" ]";
	@echo "CI_PROJECT_NAME = [ "${CI_PROJECT_NAME}" ]";
	@echo "CI_PROJECT_DIR = [ "${CI_PROJECT_DIR}" ]";
	@echo "TARGET_DIR_ON_HOST = [ "${TARGET_DIR_ON_HOST}" ]";
	@echo "==========";
	@cat CHANGELOG.md || true;
	@echo "==========";
	@echo;

.PHONY: structure
structure: ## Build structure
	@echo "creating app structure ..."; date;

	@echo "[info]   make build dir ...";
	mkdir -pv ${CI_PROJECT_DIR}/build || true;

	@echo "[info]   copy env files ...";
	cp ${TARGET_DIR_ON_HOST}/constants/${CI_PROJECT_NAME}/.env ${CI_PROJECT_DIR}/.env;

	@echo "[info]   copy docker files ...";
	cp ${CI_PROJECT_DIR}/docker/docker-compose.yml.tmpl ${CI_PROJECT_DIR}/build/docker-compose.yml || true;
	sed -i -e 's#:service_name#${CI_PROJECT_NAME}#g' ${CI_PROJECT_DIR}/build/docker-compose.yml || true;
	sed -i -e 's#:image#${CI_REGISTRY_IMAGE}:${CI_REGISTRY_IMAGE_VERSION}#g' ${CI_PROJECT_DIR}/build/docker-compose.yml || true;
	sed -i -e 's#:description#${CI_PROJECT_ID}#g' ${CI_PROJECT_DIR}/build/docker-compose.yml || true;
	sed -i -e 's#:name#${CI_PROJECT_NAME}#g' ${CI_PROJECT_DIR}/build/docker-compose.yml || true;

	@echo "[done]";

# DOCKER TASKS

# Docker publish
publish: docker-build docker-login docker-publish-registry docker-logout docker-clean
# Docker publish
publish-local: docker-build docker-publish-local

# Build the container
docker-login: ## Login to Gitlab-CR
	@echo "login to Gitlab-CR ..."; date;
	docker login -u ${CI_REGISTRY_USER} -p ${CI_REGISTRY_PASSWORD} ${CI_REGISTRY}
	@echo "[done]";

docker-logout: ## Logout from Gitlab-CR
	@echo "logout from Gitlab-CR ..."; date;
	docker logout;
	@echo "[done]";

.PHONY: docker-build
docker-build: ## Build the container
	@echo "docker build ..."; date;
	time DOCKER_BUILDKIT=1 docker build -f docker/Dockerfile  -t ${CI_REGISTRY_IMAGE} .;
	@echo "[done]";

docker-publish-local: ## Publish the `local` taged container to Gitlab-CR
	@echo "creating tag local ..."; date;
	docker tag ${CI_REGISTRY_IMAGE} ${CI_REGISTRY_IMAGE}:local;

docker-publish-registry: ## Publish the `latest` taged container to Gitlab-CR
	@echo "creating tag ${CI_REGISTRY_IMAGE_VERSION} ..."; date;
	docker tag ${CI_REGISTRY_IMAGE} ${CI_REGISTRY_IMAGE}:${CI_REGISTRY_IMAGE_VERSION};
	@echo "publishing ${CI_REGISTRY_IMAGE_VERSION} to ${CI_REGISTRY_IMAGE} ..."; date;
	docker push ${CI_REGISTRY_IMAGE}:${CI_REGISTRY_IMAGE_VERSION};

.PHONY: docker-clean
docker-clean: ## Clean unused app images
	@echo "cleaning build ..."; date;
	docker rmi $(shell docker images '${CI_REGISTRY_IMAGE}' -a -q) || true;
	@echo "[done]";

.PHONY: docker-deploy
docker-deploy: ## Deploy to server
	@echo "deploying files on target dir ..."; date;

	@echo "[info]   make target dir ..."
	mkdir -pv ${TARGET_DIR_ON_HOST}/${CI_PROJECT_NAME};

	@echo "[info]   backup docker files ...";
	mkdir -pv ${RSYNC_BACKUP_DIR};
	cp ${TARGET_DIR_ON_HOST}/${CI_PROJECT_NAME}/docker-compose.yml ${RSYNC_BACKUP_DIR}/docker-compose.$(shell date +%Y%m%d%H%M%S).yml  || true
	cp ${CI_PROJECT_DIR}/build/docker-compose.yml ${TARGET_DIR_ON_HOST}/${CI_PROJECT_NAME}/ || true

	@echo "[info]   docker deploy ..."; date;
	@cd ${TARGET_DIR_ON_HOST}/${CI_PROJECT_NAME}/
	docker compose -f ${TARGET_DIR_ON_HOST}/${CI_PROJECT_NAME}/docker-compose.yml pull --quiet
	docker compose -f ${TARGET_DIR_ON_HOST}/${CI_PROJECT_NAME}/docker-compose.yml up -d

	@echo "[done]";

### HELPERS

clean: ## Clean build dir
	@echo "cleaning previous build ..."; date;
	rm -fr ${CI_PROJECT_DIR}/build || true;
	@echo "[done]";

netrc: ## Add .netrc
	@echo "private repos ..."; date;
	@echo -e "machine ${CI_SERVER_HOST} login ${GITLAB_USER_LOGIN} password ${GITLAB_USER_TOKEN}" > ~/.netrc