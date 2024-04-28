packer {
  required_plugins {
    googlecompute = {
      version = ">= 1.1.4"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

locals {
  timestamp = formatdate("MM-DD-YYYY-hh-mm-ss", timestamp())
}

source "googlecompute" "centos" {
  project_id   = "${var.project_id}"
  source_image = "${var.source_image}"
  image_name   = "custom-${local.timestamp}"
  image_family = "${var.image_family}"
  zone         = "${var.zone}"
  ssh_username = "${var.ssh_username}"
  network      = "${var.network}"
}

build {
  sources = ["source.googlecompute.centos"]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/webapp.zip"
    generated   = true
  }

  provisioner "file" {
    source      = "packer/scripts/mywebapp.service"
    destination = "/tmp/mywebapp.service"
  }

  provisioner "file" {
    source      = "packer/scripts/config.yaml"
    destination = "/tmp/config.yaml"
  }


  provisioner "file" {
    source      = ".env"
    destination = "/tmp/.env"
    generated   = true
  }

  provisioner "shell" {
    scripts = ["packer/scripts/dependencies.sh",
      "packer/scripts/file-transfer.sh",
      "packer/scripts/create-user.sh",
      "packer/scripts/service.sh",
      "packer/scripts/ops-agent.sh"
    ]
  }

}
