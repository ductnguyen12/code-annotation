# Code Annotation

An source code annotation tool based on likert scale.

## Documentation

Please refer to our [documentation](https://github.com/ductnguyen12/code-annotation/wiki) for more information.

## Installation

To run the whole application in development mode at local machine, run the following command:
```
docker-compose -f compose.dev.yaml up --build
```

To build docker images for production, run docker compose build:
```
docker compose -f compose.production.yaml build
```

To run in production mode, run the following command (add --build if you want to rebuild):
```
docker compose -f compose.production.yaml --env-file .env.production up -d
```

To deploy monitoring components, run the following command:
```
docker compose -f server/monitoring/compose.collector.yaml up -d
```

**Note:** Please edit *.env files then copy it to /mnt/secrets/ directory as defining in compose file in order to mount to containers. Also, the data of postgresql is mounted from /mnt/postgresql/ in host machine.

Make sure to install docker and docker-compose before trying to run this application by docker.

If there is any error that is unable to find **docker.sock** in Mac, simply create a symlink like this:
```
sudo ln -s -f /Users/<user>/.docker/run/docker.sock /var/run/docker.sock
```
