
# limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
# Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
#
# To the extent possible under law, the author(s) have dedicated all copyright
# and related and neighboring rights to this software to the public domain worldwide.
# This software is distributed without any warranty.
#
# You should have received a copy of the CC0 Public Domain Dedication along with this software.
# If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

class LimbusBuildgen < Formula
  desc "\"build anywhere\" C/C++ makefile/project generator."
  homepage "https://github.com/redien/limbus-buildgen"
  url "https://github.com/redien/limbus-buildgen/archive/v0.1.1-alpha.tar.gz"
  version "0.1.1"
  sha256 "ea68c72e29a986a1280c077f3f235b628e4c5a42627aad67dfa7b7eefde82308"

  def install
    system "make"
    bin.install "limbus-buildgen"
  end

  test do
    system "limbus-buildgen"
  end
end
