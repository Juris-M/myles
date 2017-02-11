#!/bin/bash

set -e

# Release-dance code goes here.

# Constants
PRODUCT="Myles: modular CSL-M styles for law"
IS_BETA="false"
FORK="myles"
BRANCH="myles-5.0"
CLIENT="myles"
VERSION_ROOT="1.1."
SIGNED_STUB="modular_styles_for_juris_m-"

function build-the-plugin () {
    set-install-version
    find . -name '.hg' -prune -o \
        -name '.hgignore' -prune -o \
        -name '.gitmodules' -prune -o \
        -name '*~' -prune -o \
        -name '.git' -prune -o \
        -name 'attic' -prune -o \
        -name 'attic' -prune -o \
        -name '.hgsub' -prune -o \
        -name '.hgsubstate' -prune -o \
        -name '*.bak' -prune -o \
        -name '*.tmpl' -prune -o \
        -name 'version' -prune -o \
        -name 'jm-sh' -prune -o \
        -name 'releases' -prune -o \
        -name 'bin-lib' -prune -o \
        -name 'sh-lib' -prune -o \
        -name 'build.sh' -prune -o \
        -print | xargs zip "${XPI_FILE}" >> "${LOG_FILE}"
}

. jm-sh/frontend.sh
