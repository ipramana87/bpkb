Ext.Loader.setConfig({
	enabled: true
});

Ext.Loader.setPath('Ext.ux', gBaseUX);

Ext.require([
	'Ext.ux.form.NumericField',
	'Ext.ux.ProgressBarPager',
	'Ext.ProgressBar',
	'Ext.view.View',
]);

Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.util.Format.thousandSeparator = ',';
	Ext.util.Format.decimalSeparator = '.';
	
	var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

	Ext.define('DataGridBPKB', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_nama_cabang', type: 'string'},
			{name: 'fd_tgl_kirim', type: 'string'},
			{name: 'fs_jumlah_bpkb', type: 'string'}
		]
	});

	var grupHistory = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridBPKB',
		pageSize: 25,
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				rootProperty: 'hasil',
				totalProperty: 'total',
				type: 'json'
			},
			type: 'ajax',
			url: 'terimabpkbdaricabang/grid'
		},listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}		
	});

	var gridDataBPKB = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 400,
		sortableColumns: false,
		store: grupHistory,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'Cabang',
			dataIndex: 'fs_Kode_cabang',
			menuDisabled: true,
			width: 200
		},{
			text: 'Tanggal Kirim',
			dataIndex: 'fd_tgl_kirim',
			menuDisabled: true,
			width: 200
		},{
			text: 'Jumlah BPKB',
			dataIndex: 'fs_jumlah_bpkb',
			menuDisabled: true,
			width: 200
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: ''
		}),
		tbar: [{
			flex: 1.4,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Nama Cabang',
				id: 'txtCari',
				name: 'txtCari',
				xtype: 'textfield'
			}]
		},{
			flex: 0.2,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '100%',
				text: 'Search',
				xtype: 'button',
				handler: function() {
				grupHistory.load();
				}
			}]
		},{
			flex: 0.1,
			layout: 'anchor',
			xtype: 'container',
			items: []
		}],
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('txtNama').setValue(record.get('fs_nama'));
				Ext.getCmp('txtNoPolisi').setValue(record.get('fs_no_polisi'));
				Ext.getCmp('txtNoBPKB').setValue(record.get('fs_no_BPKP'));
				Ext.getCmp('txtNamaBPKB').setValue(record.get('fs_nama_BPKB'));
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false,
			stripeRows: true
		}
	});	

	Ext.define('DataGridDaftarTransaksi', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_nama', type: 'string'},
			{name: 'fs_no_polisi', type: 'string'},
			{name: 'fs_no_BPKP', type: 'string'},
			{name: 'fs_nama_BPKB', type: 'string'}

		]
	});

	var grupDaftarTransaksi = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridDaftarTransaksi',
		pageSize: 25,
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				rootProperty: 'hasil',
				totalProperty: 'total',
				type: 'json'
			},
			type: 'ajax',
			url: 'terimabpkbdaricabang/grid'
		},listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari1').getValue()
				});
			}
		}		
	});

	var gridHistory = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 400,
		sortableColumns: false,
		store: grupHistory,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'Tanggal Kirim',
			dataIndex: 'fd_tgl_kirim',
			menuDisabled: true,
			width: 200
		},{
			text: 'Tanggal Terima',
			dataIndex: 'fd_tgl_Terima',
			menuDisabled: true,
			width: 200
		},{
			text: 'Cabang',
			dataIndex: 'fs_nama_cabang',
			menuDisabled: true,
			width: 200
		},{
			text: 'Jumlah BPKB',
			dataIndex: 'fs_jumlah_bpkb',
			menuDisabled: true,
			width: 200
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: ''
		}),
		tbar: [{
			flex: 1.4,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Nama Cabang',
				id: 'txtCari1',
				name: 'txtCari1',
				xtype: 'textfield'
			}]
		},{
			flex: 0.2,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '100%',
				text: 'Search',
				xtype: 'button',
				handler: function() {
				grupDaftarTransaksi.load();
				}
			}]
		},{
			flex: 0.1,
			layout: 'anchor',
			xtype: 'container',
			items: []
		}],
		listeners: {
			itemdblclick: function(grid, record) {
	
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false,
			stripeRows: true
		}
	});

	Ext.define('DataGridDaftarKirim', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_no_bpkb', type: 'string'},
			{name: 'fs_no_rangka', type: 'string'},
			{name: 'fs_no_mesin', type: 'string'},
			{name: 'fs_no_polisi', type: 'string'},
		]
	});

	var grupDaftarKirim = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridDaftarKirim',
		pageSize: 25,
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				rootProperty: 'hasil',
				totalProperty: 'total',
				type: 'json'
			},
			type: 'ajax',
			url: 'terimadaricabang/gridkirim'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari2').getValue()
				});
			}
		}		
	});

	var gridDaftarKirim = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 400,
		sortableColumns: false,
		store: grupDaftarKirim,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'No. BPKB',
			dataIndex: 'fs_no_bpkb',
			menuDisabled: true,
			flex: 1
		},{
			text: 'No. Rangka',
			dataIndex: 'fs_no_rangka',
			menuDisabled: true,
			flex: 1
		},{
			text: 'No. Mesin',
			dataIndex: 'fs_no_mesin',
			menuDisabled: true,
			flex: 1
		},{
			text: 'No. Polisi',
			dataIndex: 'fs_no_polisi',
			menuDisabled: true,
			flex: 1
		}],
		tbar: [{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'No. BPKB',
				id: 'txtCari2',
				name: 'txtCari2',
				xtype: 'textfield'
			}]
		},{
			flex: 0.2,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '100%',
				text: 'Search',
				xtype: 'button',
				handler: function() {
					grupDaftarKirim.load();
				}
			}]
		},{
			flex: 0.1,
			layout: 'anchor',
			xtype: 'container',
			items: []
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupDaftarKirim	
		}),
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('txtNoPJJ').setValue(record.get('fn_no_pjj'));
				Ext.getCmp('txtNamaKonsumen').setValue(record.get('fs_nama_pemilik'));
				Ext.getCmp('txtJenisKendaraan').setValue(record.get('fs_jenis_kendaraan'));
				Ext.getCmp('txtTahunKendaraan').setValue(record.get('fn_tahun_kendaraan'));
				Ext.getCmp('txtWarnaKendaraan').setValue(record.get('fs_warna_kendaraan'));
				Ext.getCmp('txtNomerMesin').setValue(record.get('fs_no_mesin'));
				Ext.getCmp('txtNomerRangka').setValue(record.get('fs_no_rangka'));
				Ext.getCmp('txtNoPolisi').setValue(record.get('fs_no_polisi'));
				Ext.getCmp('txtNoBPKB').setValue(record.get('fs_no_bpkb'));
				Ext.getCmp('txtNoFaktur').setValue(record.get('fs_no_faktur'));
		
				// CHANGE TAB
				var tabPanel = Ext.ComponentQuery.query('tabpanel')[0];
				tabPanel.setActiveTab('tab2');
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false,
			stripeRows: true
		}
	});

	Ext.define('DataGridTerimaBPKB', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_no_bpkb', type: 'string'},
			{name: 'fs_no_rangka', type: 'string'},
			{name: 'fs_no_mesin', type: 'string'},
			{name: 'fs_no_polisi', type: 'string'},		]
	});

	var grupDaftarTerima = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridTerimaBPKB',
		pageSize: 25,
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				rootProperty: 'hasil',
				totalProperty: 'total',
				type: 'json'
			},
			type: 'ajax',
			url: 'terimadaricabang/gridterima'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari3').getValue()
				});
			}
		}		
	});

	var gridDaftarTerima = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 400,
		sortableColumns: false,
		store: grupDaftarTerima,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'No. BPKB',
			dataIndex: 'fs_no_bpkb',
			menuDisabled: true,
			flex: 1
		},{
			text: 'No. Rangka',
			dataIndex: 'fs_no_rangka',
			menuDisabled: true,
			flex: 1
		},{
			text: 'No. Mesin',
			dataIndex: 'fs_no_mesin',
			menuDisabled: true,
			flex: 1
		},{
			text: 'No. Polisi',
			dataIndex: 'fs_no_polisi',
			menuDisabled: true,
			flex: 1
		}],
		tbar: [{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'No. BPKB',
				id: 'txtCari3',
				name: 'txtCari3',
				xtype: 'textfield'
			}]
		},{
			flex: 0.2,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '100%',
				text: 'Search',
				xtype: 'button',
				handler: function() {
					grupDaftarTerima.load();
				}
			}]
		},{
			flex: 0.1,
			layout: 'anchor',
			xtype: 'container',
			items: []
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupDaftarTerima	
		}),
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('txtNoPJJ').setValue(record.get('fn_no_pjj'));
				Ext.getCmp('txtNamaKonsumen').setValue(record.get('fs_nama_pemilik'));
				Ext.getCmp('txtJenisKendaraan').setValue(record.get('fs_jenis_kendaraan'));
				Ext.getCmp('txtTahunKendaraan').setValue(record.get('fn_tahun_kendaraan'));
				Ext.getCmp('txtWarnaKendaraan').setValue(record.get('fs_warna_kendaraan'));
				Ext.getCmp('txtNomerMesin').setValue(record.get('fs_no_mesin'));
				Ext.getCmp('txtNomerRangka').setValue(record.get('fs_no_rangka'));
				Ext.getCmp('txtNoPolisi').setValue(record.get('fs_no_polisi'));
				Ext.getCmp('txtNoBPKB').setValue(record.get('fs_no_bpkb'));
				Ext.getCmp('txtNoFaktur').setValue(record.get('fs_no_faktur'));
		
				// CHANGE TAB
				var tabPanel = Ext.ComponentQuery.query('tabpanel')[0];
				tabPanel.setActiveTab('tab2');
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false,
			stripeRows: true
		}
	});

	// COMPONENT FORM KIRIM BPKB
	var btnSave = {
		anchor: '100%',
		scale: 'medium',
		xtype: 'button',
		id: 'btnSave',
		name: 'btnSave',
		text: 'Save',
		iconCls: 'icon-save',
		handler: ''
	};

	var txtDikirim = {
		anchor: '98%',
		fieldLabel: 'Jumlah BPKB Dikirim',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtDikirim',
		name: 'txtDikirim',
		xtype: 'numberfield',
		minValue: 0,
		maxLength: 35,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtDiterima = {
		anchor: '98%',
		fieldLabel: 'Jumlah BPKB Diterima',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtDiterima',
		name: 'txtDiterima',
		xtype: 'numberfield',
		minValue: 0,
		maxLength: 35,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtSelisih = {
		anchor: '98%',
		fieldLabel: 'Selisih BPKB',
		emptyText: '',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtSelisih',
		name: 'txtSelisih',
		xtype: 'numberfield',
		minValue: 0,
		maxLength: 35,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	// FUNCTIONS
	function fnReset() {
	}
								
	function fnCekSave() {

	}
		
	function fnSave() {

	}

	function fnRemove() {

	}

	var frmTerimaBPKBDariCabang = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Terima BPKB Dari Cabang',
		width: 930,
		items: [{
			activeTab: 0,
			bodyStyle: 'padding: 5px; background-color: '.concat(gBasePanel),
			border: false,
			plain: true,
			xtype: 'tabpanel',
			items: [{
				id: 'tab1',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				title: 'Transaksi Kirim Ke Pusat',
				xtype: 'form',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 140,
						msgTarget: 'side'
					},	
					xtype: 'fieldset',
					title: 'Daftar Transaksi',
					style: 'padding: 5px;',
					items: [
						gridDataBPKB
					]
				}]
			},{
				id: 'tab2',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				title: 'Daftar BPKB Di Kirim',
				xtype: 'form',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},	
					xtype: 'fieldset',
					border: false,
					items: [{
						anchor: '100%',
						layout: 'hbox',
						xtype: 'container',
						items: [{
							flex: 2,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '98%',
								title: 'Daftar BPKB Di Kirim',
								style: 'padding: 5px;',
								xtype: 'fieldset',
								items: [
									gridDaftarKirim
								]
							}]	
						}]
					}]
				}],
			},{
				id: 'tab3',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				xtype: 'form',
				title: 'Daftar BPKB Di Terima',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},
					anchor: '100%',
					style: 'padding: 5px;',
					title: 'Daftar BPKB Di Terima',
					xtype: 'fieldset',
					items: [
						gridDaftarTerima
					]
				}]
			},{
				id: 'tab4',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				xtype: 'form',
				title: 'Konfirmasi Di Terima',
				items: [{

					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'

					},
					flex: 0.5,
					anchor: '30%',
					style: 'padding: 5px;',
					title: 'Konfirmasi Di Terima',
					xtype: 'fieldset',
					items: [
						txtDikirim,
						txtDiterima,
						txtSelisih,
						btnSave
					]

				}]
			},{
				id: 'tab5',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				xtype: 'form',
				title: 'History',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},
					anchor: '100%',
					style: 'padding: 5px;',
					title: 'History',
					xtype: 'fieldset',
					items: [
						gridHistory
					]
				}]	
			}]		
		}]	
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmTerimaBPKBDariCabang
	});

	function fnMaskShow() {
		frmTerimaBPKBDariCabang.mask('Please wait...');
	}

	function fnMaskHide() {
		frmTerimaBPKBDariCabang.unmask();
	}
	
	frmTerimaBPKBDariCabang.render(Ext.getBody());
	Ext.get('loading').destroy();
});