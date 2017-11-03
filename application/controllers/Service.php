<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Service extends CI_Controller {

	public function terima($cabang, $bpkb) {
		$this->load->model('MService');
	}

	public function keluar($cabang, $bpkb) {
		$this->load->model('MService');
	}

}