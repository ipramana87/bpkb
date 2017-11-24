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

	Ext.define('DataGridApprove', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_nama_cabang', type: 'string'},
			{name: 'fn_no_pjj', type: 'string'},
			{name: 'fs_nama_pemilik', type: 'string'},
		]
	});

	var grupApprove = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridApprove',
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
			url: 'Approvebpkb/gridapprove'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					//'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}		
	});

	Ext.define('DataGridDetailBPKB', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_no_bpkb', type: 'string'},
		]
	});

	var grupDetailBPKB = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridDetailBPKB',
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
			url: 'Approvebpkb/griddetailbpkb'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari1').getValue()
				});
			}
		}		
	});

	Ext.define('DataGridHistory', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fd_tgl_kirim', type: 'string'},
			{name: 'fd_tgl_terima', type: 'string'},
			{name: 'fs_nama_cabang', type: 'string'},
			{name: 'fs_pengirim', type: 'string'},
			{name: 'fs_penerima', type: 'string'},
			{name: 'fs_jumlah_bpkb', type: 'string'}
		]
	});

	var grupHistory = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridHistory',
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
			url: 'Approvebpkb/gridhistory'
		},listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari3').getValue()
				});
			}
		}		
	});

	// GRID HISTORY
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
			dataIndex: 'fd_tgl_terima',
			menuDisabled: true,
			width: 200
		},{
			text: 'Cabang',
			dataIndex: 'fs_nama_cabang',
			menuDisabled: true,
			width: 200
		},{
			text: 'Pengirim',
			dataIndex: 'fs_pengirim',
			menuDisabled: true,
			width: 200
		},{
			text: 'Penerima',
			dataIndex: 'fs_penerima',
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
				Ext.getCmp('txtNoPJJ').setValue(record.get('fs_no_pjj'));
				Ext.getCmp('txtNama').setValue(record.get('fs_nama_konsumen'));
				Ext.getCmp('txtJenisKendaraan').setValue(record.get('fs_model_kendaraan'));
				Ext.getCmp('txtTahunKendaraan').setValue(record.get('fn_tahun_kendaraan'));
				Ext.getCmp('txtWarnaKendaraan').setValue(record.get('fs_warna_kendaraan'));
				Ext.getCmp('txtNomerMesin').setValue(record.get('fs_no_mesin'));
				Ext.getCmp('txtNomerRangka').setValue(record.get('fs_no_rangka'));
		
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

	// GRID DETAIL BPKB
	var gridDetailBPKB = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 400,
		sortableColumns: false,
		//store: grupKirim,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'No. BPKB',
			dataIndex: 'fs_no_bpkb',
			menuDisabled: true,
			flex: 1
		},{
			xtype:'actioncolumn',
			width: 50,
			items: [{
				iconCls: 'icon-delete',
				tooltip: 'Delete',
				handler: function(grid, rowIndex, colIndex, e) {
					var str = grid.getStore().getAt(rowIndex).get('fs_no_bpkb');
					if (str) {
						Ext.MessageBox.show({
							title:'Menghapus Data',
							msg: 'Apakah Anda ingin menghapus?',
							buttons: Ext.Msg.YESNO,
							icon: Ext.Msg.QUESTION,
							fn: function(btn) {
								if (btn == "yes") {
									Ext.Ajax.request({
										url : 'Kirimkepusat/remove/',
			            				params : {
											'fs_no_bpkb': str
										},
										success: function(response) {
											var xtext = Ext.decode(response.responseText);
											Ext.MessageBox.show({
												buttons: Ext.MessageBox.OK,
												closable: false,
												icon: Ext.MessageBox.INFO,
												message: xtext.hasil,
												title: 'BPKB'
											});
											//fnResetUser();
											//grupKirim.load();  
										},
										failure: function(response) {
											var xtext = Ext.decode(response.responseText);
											Ext.MessageBox.show({
												buttons: Ext.MessageBox.OK,
												closable: false,
												icon: Ext.MessageBox.INFO,
												message: xtext.hasil,
												title: 'BPKB'
											});
										}
									});
								}
							}
						});
					}
				}
			}]
		}],
		tbar: [{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'NO. BPKB',
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
					grupBPKB.load();
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
			//store: grupKirim	
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
				tabPanel.setActiveTab('tab1');
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

	// GRID DAFTAR APPROVE
	var gridApprove = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 400,
		sortableColumns: false,
		store: grupApprove,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'Cabang',
			dataIndex: 'fs_nama_cabang',
			menuDisabled: true,
			flex: 1
		},{
			text: 'No. PJJ',
			dataIndex: 'fn_no_pjj',
			menuDisabled: true,
			flex: 1
		},{
			text: 'Nama Konsumen',
			dataIndex: 'fs_nama_pemilik',
			menuDisabled: true,
			flex: 1
		}],
		tbar: [{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'No. PJJ',
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
					grupApprove.load();
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
			store: grupApprove
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
				//winCari.hide();
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

	// COMPONENT FORM DETAIL BPKB

	var txtpiutang = {
		anchor: '100%',
		fieldLabel: 'O/S Piutang',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtpiutang',
		name: 'txtpiutang',
		xtype: 'textfield'
	};

	var txtpokok = {
		anchor: '100%',
		fieldLabel: 'O/S Pokok',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtpokok',
		name: 'txtpokok',
		xtype: 'textfield'
	};

	var txtdenda = {
		anchor: '100%',
		fieldLabel: 'O/S Denda',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtdenda',
		name: 'txtdenda',
		xtype: 'textfield'
	};

	var cboNoBPKB = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		labelAlign: 'top',
		fieldLabel: 'No. BPKB',
		emptyText: 'No. BPKB',
		fieldStyle: 'text-transform: uppercase;',
		id: 'cboNoBPKB',
		name: 'cboNoBPKB',
		xtype: 'textfield',
		triggers: {
			reset: {
				cls: 'x-form-clear-trigger',
				handler: function(field) {
					field.setValue('');
					Ext.getCmp('').setValue('');
				}
			},
			cari: {
				cls: 'x-form-search-trigger',
				handler: function() {
					winCari.show();
					winCari.center();
				}
			}
		}
	};

	var txtNoBPKB = {
		anchor: '100%',
		fieldLabel: 'No. BPKB',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoBPKB',
		name: 'txtNoBPKB',
		xtype: 'textfield'
	};

	var txtNoPJJ = {
		anchor: '100%',
		fieldLabel: 'No. PJJ',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoPJJ',
		name: 'txtNoPJJ',
		xtype: 'textfield'
	};

	var txtNamaKonsumen = {
		anchor: '100%',
		fieldLabel: 'Nama Konsumen',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNamaKonsumen',
		name: 'txtNamaKonsumen',
		xtype: 'textfield'
	};

	var cboTglBPKB = {
		anchor: '100%',
		editable: false,
		fieldLabel: 'Tanggal BPKB',
		format: 'd-m-Y',
		id: 'cboTglBPKB',
		name: 'cboTglBPKB',
		maskRe: /[0-9-]/,
		xtype: 'datefield'
	};

	var txtJenisKendaraan = {
		anchor: '100%',
		fieldLabel: 'Jenis Kendaraan',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtJenisKendaraan',
		name: 'txtJenisKendaraan',
		xtype: 'textfield'
	};

	var txtTahunKendaraan = {
		anchor: '100%',
		fieldLabel: 'Tahun Kendaraan',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtTahunKendaraan',
		name: 'txtTahunKendaraan',
		xtype: 'textfield'
	};

	var txtWarnaKendaraan = {
		anchor: '100%',
		fieldLabel: 'Warna Kendaraan',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtWarnaKendaraan',
		name: 'txtWarnaKendaraan',
		xtype: 'textfield'
	};

	var txtNomerRangka = {
		anchor: '100%',
		fieldLabel: 'Nomer Rangka',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNomerRangka',
		name: 'txtNomerRangka',
		xtype: 'textfield'
	};

	var txtNomerMesin = {
		anchor: '100%',
		fieldLabel: 'Nomer Mesin',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNomerMesin',
		name: 'txtNomerMesin',
		xtype: 'textfield'
	};

	var txtNoPolisi = {
		anchor: '100%',
		fieldLabel: 'No. Polisi',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoPolisi',
		name: 'txtNoPolisi',
		xtype: 'textfield'
	};	

	var cboTglTerbit = {
		anchor: '98%',
		editable: true,
		fieldLabel: 'Tgl Terbit BPKB',
		format: 'd-m-Y',
		id: 'cboTglTerbit',
		name: 'cboTglTerbit',
		maskRe: /[0-9-]/,
		minValue: Ext.Date.add(new Date(), Ext.Date.YEAR, -75),
		xtype: 'datefield',
		value: new Date()
	}

	var cboTglTerbitSTNK = {
		anchor: '98%',
		editable: true,
		fieldLabel: 'Tgl Terbit STNK',
		format: 'd-m-Y',
		id: 'cboTglTerbitSTNK',
		name: 'cboTglTerbitSTNK',
		maskRe: /[0-9-]/,
		minValue: Ext.Date.add(new Date(), Ext.Date.YEAR, -75),
		xtype: 'datefield',
		value: new Date()
	}

	var btnApprove= {
		anchor: '100%',
		scale: 'medium',
		xtype: 'button',
		id: 'btnApprove',
		name: 'btnApprove',
		text: 'Approve',
		iconCls: 'icon-save',
		handler: ''
	};

	var txtNoFaktur = {
		anchor: '100%',
		fieldLabel: 'No. Faktur',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoFaktur',
		name: 'txtNoFaktur',
		xtype: 'textfield'
	};

	var txtNoTempatBPKB = {
		anchor: '100%',
		fieldLabel: 'Tempat BPKB',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoTempatBPKB',
		name: 'txtNoTempatBPKB',
		xtype: 'textfield'
	};

	var txtNoLoker = {
		anchor: '100%',
		fieldLabel: 'Loker',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoLoker',
		name: 'txtNoLoker',
		xtype: 'textfield'
	};

	var frmApproveBPKB = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Approve Penyerahan BPKB',
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
				title: 'Daftar Approve',
				xtype: 'form',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},	
					xtype: 'fieldset',
					title: 'Daftar Approve',
					style: 'padding: 5px;',
					items: [
						gridApprove
					]
				}]
			},{
				id: 'tab2',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				title: 'Detail BPKB',
				xtype: 'form',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 100,
						msgTarget: 'side'
					},	
					xtype: 'fieldset',
					border: false,
					style: 'padding: 1px;',
					items: [{
						anchor: '100%',
						layout: 'hbox',
						xtype: 'container',
						items: [{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '98%',
								style: 'padding: 5px;',
								title: '',
								xtype: 'fieldset',
								items: [
									txtNoPJJ,
									txtNamaKonsumen,
									txtJenisKendaraan,
									txtTahunKendaraan,
									txtWarnaKendaraan,
									txtNomerRangka,
									txtNomerMesin,
									txtNoPolisi,
									txtNoBPKB
								]
							}]
						},{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '100%',
								style: 'padding: 7px;',
								title: '',
								xtype: 'fieldset',
								items: [
									cboTglTerbit,
									cboTglTerbitSTNK,
									txtNoFaktur,
									txtNoTempatBPKB,
									txtNoLoker,
									txtpiutang,
									txtpokok,
									txtdenda,
									btnApprove
								]
							}]
						}]
					}]
				}]
			},{
				id: 'tab3',
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
		target: frmApproveBPKB
	});

	function fnMaskShow() {
		frmApproveBPKB.mask('Please wait...');
	}

	function fnMaskHide() {
		frmApproveBPKB.unmask();
	}
	
	frmApproveBPKB.render(Ext.getBody());
	Ext.get('loading').destroy();
});