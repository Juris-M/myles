
function set-install-version () {
    sed -si "s/<em:version>.*<\/em:version>/<em:version>${VERSION}<\/em:version>/" install.rdf
    sed -si "s/<em:updateURL>.*<\/em:updateURL>/<em:updateURL>https:\/\/juris-m.github.io\/${CLIENT}\/update.rdf<\/em:updateURL>/" install.rdf
}

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
        -name 'releases' -prune -o \
        -name 'bin-lib' -prune -o \
        -name 'sh-lib' -prune -o \
        -name 'build.sh' -prune -o \
        -print | xargs zip "${XPI_FILE}" >> "${LOG_FILE}"
}

