
pkgname=wellnesswizard
pkgver=1.0.0
pkgrel=1
pkgdesc='An AI powered posture checker'
arch=('x86_64')
url='https://github.com/halftonenano/Hackathon_gitinit'
license=('MIT')
depends=('electron' 'nodejs')
makedepends=('electron' 'nodejs' 'asar')
source=("git+https://github.com/halftonenano/Hackathon_gitinit.git" "git+https://github.com/NotARoomba/WellnessWizard.git")
md5sums=("4f2be775cadfd2e533b20115e03bb36f" "61b76a22e422251a336f056c2ce1a976")
validpgpkeys=("3F1D0F4F5CB714A85C68C419E9DA3FA40632F32B" "3F1D0F4F5CB714A85C68C419E9DA3FA40632F32B")
prepare() {
  cd "$srcdir"
  git clone "${source[0]}" "${pkgname}-${pkgver}"
  cd "${pkgname}-${pkgver}"
  patch -p1 -i "patches.patch"
}
build() {
    cd "${pkgname}-${pkgver}/client"
    npm run build
    cd ..
    sudo electron-builder
}

package() {
    echo hi
}