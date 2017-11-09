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
			{name: 'fs_no_rangka', type: 'string'},
			{name: 'fs_no_bpkb', type: 'string'},
			{name: 'fs_nama_bpkb', type: 'string'},
			{name: 'fd_tanggal_bpkb', type: 'string'}
		]
	});

	Ext.define('Image', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'src', type: 'string'}
		]
	});

	var grupBPKB = Ext.create('Ext.data.Store', {
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
			url: 'cetakqrcode/gridbpkb'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}		
	});

	var dataImg = Ext.create('Ext.data.Store', {
		autoLoad: false,
		model: 'Image',
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				type: 'json'
			},
			type: 'ajax',
			url: 'cetakqrcode/preview'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_no_bpkb': Ext.getCmp('txtNoBPKB').getValue()
				});
			}
		}
	});

	// POPUP CETAK QRCODE
	var winPopUp = {};

	// COMPONENT FORM BPKB
	var txtNoBPKB = {
		anchor: '100%',
		fieldLabel: 'No. BPKB',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNoBPKB',
		name: 'txtNoBPKB',
		xtype: 'textfield'
	};

	var txtNamaBPKB = {
		anchor: '100%',
		fieldLabel: 'Nama',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtNamaBPKB',
		name: 'txtNamaBPKB',
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

	var imageTpl = new Ext.XTemplate(
		'<tpl for=".">',
			'<div class="thumb-wrap">',
				'<img src="{src}" width="110px" height="110px" />',
			'</div>',
		'</tpl>'
	);

	var changingImage = Ext.create('Ext.view.View', {
		align: 'center',
		itemSelector: 'div.thumb-wrap',
		store: dataImg,
		tpl: imageTpl
	});
	
	// GRID BPKB
	var gridBPKB = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 400,
		sortableColumns: false,
		store: grupBPKB,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			align: 'center',
			text: 'Add',
			boxLabel: 'add',
			id: 'cekadd',
			dataIndex: 'fb_cek',
			menuDisabled: true,
			stopSelection: false,
			xtype: 'checkcolumn',
			width: 35,
			locked: true
		},{
			text: 'No. BPKB',
			dataIndex: 'fs_no_bpkb',
			menuDisabled: true,
			flex: 1.5
		},{
			text: 'Nama Konsumen',
			dataIndex: 'fs_nama_bpkb',
			menuDisabled: true,
			flex: 3
		},{
			text: 'Tanggal',
			dataIndex: 'fd_tanggal_bpkb',
			menuDisabled: true,
			flex: 1
		},{
			text: 'Jenis Kendaraan',
			dataIndex: 'fs_jenis_kendaraan',
			menuDisabled: true,
			hidden: true
		}],
		tbar: [{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Nama Konsumen',
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
			store: grupBPKB
		}),
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('txtNoBPKB').setValue(record.get('fs_no_bpkb'));
				Ext.getCmp('txtNamaBPKB').setValue(record.get('fs_nama_bpkb'));
				Ext.getCmp('cboTglBPKB').setValue(record.get('fd_tanggal_bpkb'));
				Ext.getCmp('txtJenisKendaraan').setValue(record.get('fs_jenis_kendaraan'));
				Ext.getCmp('txtTahunKendaraan').setValue(record.get('fn_tahun_kendaraan'));
				Ext.getCmp('txtWarnaKendaraan').setValue(record.get('fs_warna_kendaraan'));
				Ext.getCmp('txtNomerMesin').setValue(record.get('fs_no_mesin'));
				Ext.getCmp('txtNomerRangka').setValue(record.get('fs_no_rangka'));
				
				// LOAD IMAGE QR CODE
				dataImg.load();

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

	function fnReset() {
		grupBPKB.load();
	}

	function fnCekPrint() {
		if (this.up('form').getForm().isValid()) {
			var xnobpkb = 0;
			var store = gridBPKB.getStore();
			store.each(function(record, idx) {
				xcek = record.get('fb_cek');

				if (xcek === true) {
					xnobpkb = xnobpkb + 1;
				}
			});

		Ext.Ajax.on('beforerequest', fnMaskShow);
		Ext.Ajax.on('requestcomplete', fnMaskHide);
		Ext.Ajax.on('requestexception', fnMaskHide);
		Ext.Ajax.request({
				method: 'POST',
				url: 'cetakqrcode/cekprint',
				params: {
					'is_nobpkb': xnobpkb,
				},
				success: function(response) {
					var xtext = Ext.decode(response.responseText);
					if (xtext.sukses === true) {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.YESNO,
							closable: false,
							icon: Ext.Msg.QUESTION,
							msg: xtext.hasil,
							title: 'BPKB',
							fn: function(btn) {
								if (btn == 'yes') {
									fnPrint();
								}
							}
						});
					} else {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK,
							closable: false,
							icon: Ext.MessageBox.INFO,
							msg: xtext.hasil,
							title: 'BPKB',
		
						});
					}
				},
				failure: function(response) {
					var xtext = Ext.decode(response.responseText);
					Ext.MessageBox.show({
						buttons: Ext.MessageBox.OK,
						closable: false,
						icon: Ext.MessageBox.INFO,
						msg: 'Connection Failed!!',
						title: 'BPKB'
					});
					fnMaskHide();
				}
			});
		}
	}
	function fnPrint() {
		var xnobpkb = '';
		var cek = '';

		var store = gridBPKB.getStore();
		store.each(function(record, idx) {
			xcek = record.get('fb_cek');
			if (xcek === true) {
				xnobpkb = xnobpkb +'|'+ record.get('fs_no_bpkb');
			}
		});

		Ext.Ajax.on('beforerequest', fnMaskShow);
		Ext.Ajax.on('requestcomplete', fnMaskHide);
		Ext.Ajax.on('requestexception', fnMaskHide);

		Ext.Ajax.request({
			method: 'POST',
			url: 'cetakqrcode/print',
			params: {
				'fs_no_bpkb': xnobpkb
			},
			success: function(response) {
				var popUp = Ext.create('Ext.window.Window', {
					modal: true,
					width: 950,
					height: 600,
					closable: false,
					layout:'anchor',
					title: 'QrCode',
					buttons: [{
						text: 'Close',
						handler: function() {
							vMask.hide();
							popUp.hide();
						}
					}]
				});
				
				popUp.add({html: '<iframe width="950" height="600" src="cetakqrcode/print/"></iframe>'});
				popUp.show();	
			},
			failure: function(response) {
				var xtext = Ext.decode(response.responseText);
				Ext.MessageBox.show({
					buttons: Ext.MessageBox.OK,
					closable: false,
					icon: Ext.MessageBox.INFO,
					msg: 'Connection Failed!!',
					title: 'BPKB'
				});
				fnMaskHide();
			}
		});
	}
	
	var frmCetakQrCode = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Cetak QR Code',
		width: 550,
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
				title: 'Daftar BPKB',
				xtype: 'form',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},	
					xtype: 'fieldset',
					title: 'Daftar BPKB',
					style: 'padding: 5px;',
					items: [
						gridBPKB
					]
				}],
				buttons: [{
					iconCls: 'icon-print',
					id: 'btnPrint',
					name: 'btnPrint',
					text: 'Print QR Code',
					scale: 'medium',
					handler: fnPrint
				},{
					iconCls: 'icon-reset',
					text: 'Reset',
					scale: 'medium',
					handler: ''
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
							flex: 2.4,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '98%',
								style: 'padding: 5px;',
								title: 'BPKB',
								xtype: 'fieldset',
								items: [
									txtNoBPKB,
									txtNamaBPKB,
									cboTglBPKB,
									txtJenisKendaraan,
									txtTahunKendaraan,
									txtWarnaKendaraan,
									txtNomerMesin,
									txtNomerRangka
								]
							}]
						},{
							flex: 0.8,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '100%',
								style: 'padding: 7px;',
								title: 'QR Code',
								xtype: 'fieldset',
								items: [
									changingImage
								]
							}]
						}]
					}]
				}]
			}]
		}]
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmCetakQrCode
	});

	function fnMaskShow() {
		frmCetakQrCode.mask('Please wait...');
	}

	function fnMaskHide() {
		frmCetakQrCode.unmask();
	}
	
	frmCetakQrCode.render(Ext.getBody());
	Ext.get('loading').destroy();
});