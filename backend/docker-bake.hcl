# Copyright (C) 2024 - present Juergen Zimmermann, Hochschule Karlsruhe
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

# Aufruf:   docker buildx bake [alpine]

# Dateiformate: HCL ( = HashiCorp Configuration Language), YAML (wie in Docker Compose) oder JSON
# HCL ist maechtiger und flexibler als YAML oder JSON.

# https://docs.docker.com/build/bake/introduction
# https://docs.docker.com/build/bake/reference

target "default" {
  tags = ["docker.io/juergenzimmermann/buch:2025.4.1-bookworm"]
  #dockerfile = "Dockerfile"
}

target "alpine" {
  tags = ["docker.io/juergenzimmermann/buch:2025.4.1-alpine"]
  dockerfile = "Dockerfile.alpine"
}
