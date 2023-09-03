# Code Annotation

An source code annotation tool based on likert scale.

To run the whole application in development mode at local machine, run the following command:
```
docker-compose -f compose.dev.yaml up --build
```

To build docker images for production, run docker compose build:
```
docker-compose -f compose.production.yaml build
```

To run in production mode at local machine, run the following command (add --build if you want to rebuild):
```
docker-compose -f compose.production.yaml up
```

Make sure to install docker and docker-compose before trying to run this application by docker.

If there is any error that is unable to find **docker.sock** in Mac, simply create a symlink like this:
```
sudo ln -s -f /Users/<user>/.docker/run/docker.sock /var/run/docker.sock
```