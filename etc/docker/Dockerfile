# syntax=docker/dockerfile:1
FROM ubuntu:noble

ARG USER_UID=1000
ARG USER_GID=1000
ARG PROTO_VERSION=0.60.2
# Empty installs the version `.prototools` resolves to; set it to pin moon, for
# example when the newest release's binaries aren't published yet.
ARG MOON_VERSION=

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		bash build-essential ca-certificates curl git gzip unzip xz-utils \
	&& rm -rf /var/lib/apt/lists/*

# The base image's `ubuntu` user owns UID 1000, which `dev` takes over so
# files written into the bind-mounted checkout keep the host user's ownership.
RUN userdel --remove ubuntu 2>/dev/null || true \
	&& groupadd --gid "${USER_GID}" dev \
	&& useradd --uid "${USER_UID}" --gid "${USER_GID}" --create-home --shell /bin/bash dev

# Mount points for the compose volumes, created here so new volumes are owned by `dev`.
RUN mkdir -p \
		/workspace/node_modules \
		/workspace/.moon/cache \
		/workspace/apps/site/.cache \
		/workspace/apps/site/public \
		/workspace/apps/site/node_modules \
		/home/dev/.yarn/berry \
	&& chown -R dev:dev /workspace /home/dev

USER dev
WORKDIR /workspace

ENV PROTO_HOME=/home/dev/.proto
ENV PATH=/home/dev/.proto/shims:/home/dev/.proto/bin:${PATH}

RUN curl -fsSL https://moonrepo.dev/install/proto.sh | bash -s "${PROTO_VERSION}" --yes

COPY --chown=dev:dev .prototools /workspace/.prototools

RUN proto install node \
	&& proto install yarn \
	&& proto install moon ${MOON_VERSION}
