Ext.define('FusionTrack.view.Viewport', {
    extend: 'Ext.Container',

    config: {
        layout: {
            type: 'card'
        },
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'FusionTrack'
            },
            {
                xtype: 'tabpanel',
                tabBar: {
                    docked: 'bottom'
                },
                items: [
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'fit'
                        },
                        title: 'Aufzeichnen',
                        iconCls: 'locate',
                        items: [
                            {
                                xtype: 'map',
                                id: 'gftmap',
                                mapOptions: {
                                    zoom: 5
                                },
                                useCurrentLocation: true
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        scrollable: true
,
                        title: 'Tracks',
                        iconCls: 'user',
                        items: [
                            {
                                xtype: 'fieldset',
                                title: 'Ebenen',
                                items: [
                                    {
                                        xtype: 'checkboxfield',
                                        id: 'schweizerStaedteCheckbox',
                                        label: 'Schweizer Städte',
                                        name: 2741123
                                    },
                                    {
                                        xtype: 'togglefield',
                                        id: 'schweizerStaedteToggle',
                                        label: 'Schweizer Städte',
                                        name: 2741123
                                    },
                                    {
                                        xtype: 'sliderfield',
                                        disabled: true,
                                        id: 'schweizerStaedteEinwohner',
                                        label: 'Einwohner',
                                        name: 'Einwohner',
                                        increment: 1000,
                                        maxValue: 600000
                                    },
                                    {
                                        xtype: 'numberfield',
                                        disabled: true,
                                        id: 'populationValue',
                                        label: 'Einwohner',
                                        readOnly: true
                                    },
                                    {
                                        xtype: 'checkboxfield',
                                        id: 'coinCheckbox',
                                        label: 'Coin',
                                        name: 3107027
                                    },
                                    {
                                        xtype: 'togglefield',
                                        id: 'coinToggle',
                                        label: 'Coin',
                                        name: 3107027
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }

});
