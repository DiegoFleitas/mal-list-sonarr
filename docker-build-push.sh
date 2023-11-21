# builds and pushes a new version of the image to dockerhub
docker buildx build --platform linux/amd64,linux/arm64 --push -t DiegoFleitas/mal-list-sonarr:$1 .