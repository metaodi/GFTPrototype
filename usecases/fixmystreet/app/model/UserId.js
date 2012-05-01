Ext.define('FixMyStreet.model.UserId', {
    extend: 'Ext.data.Model',
    config: {
		identifier: 'uuid',
		
		proxy: {
            type: 'localstorage',
            id: 'fixmystreet-userid'
        }
    }
});