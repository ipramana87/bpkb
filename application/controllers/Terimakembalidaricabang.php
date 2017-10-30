<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Terimakembalidaricabang extends CI_Controller {

	public function __construct() {
		parent::__construct();
		if ($this->session->userdata('login') <> TRUE) {
			redirect('login');
		}
	}

	public function index() {
		$this->load->view('vterimakembalidaricabang');
	}

}