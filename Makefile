BUILD_ID=2

build: build_id
	docker build -t toy-robot:${BUILD_ID} .

run: build
	docker run --rm toy-robot:${BUILD_ID}

debug: build
	docker run -it toy-robot:${BUILD_ID} bash

build_id:
ifndef BUILD_ID
	@echo "BUILD_ID is not set, will use default id 1"
	BUILD_ID=1
endif
