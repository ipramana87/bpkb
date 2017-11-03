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
			id: 'add',
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

	}

	function fnCekPrint() {
		Ext.Ajax.on('beforerequest', fnMaskShow);
		Ext.Ajax.on('requestcomplete', fnMaskHide);
		Ext.Ajax.on('requestexception', fnMaskHide);
	}

	function fnPrint() {
		Ext.Ajax.on('beforerequest', fnMaskShow);
		Ext.Ajax.on('requestcomplete', fnMaskHide);
		Ext.Ajax.on('requestexception', fnMaskHide);
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
					handler: ''
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
							flex: 2.2,
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
									txtJenisKendaraan
								]
							}]
						},{
							flex: 0.8,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '100%',
								style: 'padding: 5px;',
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