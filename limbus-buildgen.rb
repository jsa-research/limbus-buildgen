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
