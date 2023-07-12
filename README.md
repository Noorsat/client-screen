# kassa

[kassa](https://gitlab.softpark.kz/ducket/frontend/kassa) - react front app for kassa

---

## How it works

- Using react

## Deploy with own gitlab-runner

GitLab Runner is an application that works with GitLab CI/CD to run jobs in a pipeline.

### Dependencies

**1. GNU Make [info](https://www.gnu.org/software/make/)**
```
sudo apt install make
```
**2. Docker [info](https://docs.docker.com/engine/install/ubuntu/)**

- Uninstall old versions

    ```
    sudo apt-get remove docker docker-engine docker.io containerd runc
    ```
- Add Docker’s official GPG key

    ```
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    ```
- Use the following command to set up the stable repository. To add the nightly or test repository, add the word nightly or test (or both) after the word stable in the commands below. Learn about nightly and test channels

    ```
    echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    ```
- Install Docker Engine

    ```
    sudo apt-get update && sudo apt-get install docker-ce docker-ce-cli containerd.io
    ```
- Install Compose on Linux systems

    ```
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

    sudo chmod +x /usr/local/bin/docker-compose
    ```
- Add user to docker group 

    ```
    sudo usermod -aG docker ${USER}
    ```
- Restart user session

**3. Gitlab Runner [info](https://docs.gitlab.com/runner/install/)**
```
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash
sudo apt-get install gitlab-runner
```

### Installation order

**1. Set gitlab-runner run user and working directory**
```
# change working-directory to $TARGET_DIR_ON_HOST
sudo sed -i 's/\/home\/gitlab-runner/\/home\/nimda\/code/' /etc/systemd/system/gitlab-runner.service

# change runinig user
sudo sed -i 's/\"--user\" \"gitlab-runner\"/\"--user\" \"nimda\"/' /etc/systemd/system/gitlab-runner.service
```
**2. Reload systemct daemons**
```
sudo systemctl daemon-reload
```
**3. Restart gitlab-runner service**
```
sudo service gitlab-runner restart
```
**4. Register gitlab-runner [info](https://docs.gitlab.com/runner/register/)**
 ```
sudo gitlab-runner register \
--non-interactive \
--url "https://gitlab.softpark.kz/" \
--registration-token "PROJECT_RUNNER_TOKEN" \
--executor "shell" \
--description "gr.ducket.kassa.{environment}" \
--tag-list "deploy,deploy.ducket.kassa.{environment}"
```