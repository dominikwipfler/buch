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
# along with this program. If not, see <https://www.gnu.org/licenses/>.

"""Lasttest mit Locust."""

from typing import Final

import urllib3
from locust import HttpUser, constant_throughput, task

# https://stackoverflow.com/questions/27981545/suppress-insecurerequestwarning-unverified-https-request-is-being-made-in-pytho#answer-44615889
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


# https://docs.locust.io/en/stable/api.html#httpuser-class
class BuchRequests(HttpUser):
    """Lasttest für HTTP-Requests fuer Server Buch."""

    # https://docs.locust.io/en/stable/writing-a-locustfile.html#wait-time-attribute
    # https://docs.locust.io/en/stable/api.html#locust.User.wait_time
    # https://docs.locust.io/en/stable/api.html#locust.wait_time.constant_throughput
    # 50 "Task Iterations" pro Sekunde
    wait_time = constant_throughput(0.1)  # type: ignore[no-untyped-call]
    MIN_USERS: Final = 500
    MAX_USERS: Final = 500

    # https://docs.locust.io/en/stable/writing-a-locustfile.html#on-start-and-on-stop-methods
    def on_start(self) -> None:
        """Initialisierung: selbst-signiertes Zertifikat erlauben."""
        self.client.verify = False

    # https://docs.locust.io/en/stable/api.html#locust.task
    # https://docs.locust.io/en/stable/api.html#locust.User.weight
    @task(100)
    def get_id(self) -> None:
        """GET-Requests mit Pfadparameter: Buch-ID."""
        id_list: Final = [1, 20, 30, 40, 50, 60]
        for buch_id in id_list:
            self.client.get(f"/rest/{buch_id}")

    @task(200)
    def get_titel(self) -> None:
        """GET-Requests mit Query-Parameter: Teilstring des Buchtitels."""
        titel_list = ["a", "l", "t", "i", "p"]
        for teil in titel_list:
            self.client.get("/rest", params={"titel": teil})

    @task(150)
    def get_isbn(self) -> None:
        """GET-Requests mit Query-Parameter: ISBN-Nummer."""
        isbn_list: Final = [
            "978-3-897-22583-1",
            "978-3-827-31552-6",
            "978-0-201-63361-0",
            "978-0-007-09732-6",
            "978-3-824-40481-0",
            "978-3-540-43081-0",
        ]
        for isbn in isbn_list:
            self.client.get("/rest", params={"isbn": isbn})
