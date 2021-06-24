# Modaly #

Very simple module to create modals on the fly. Features callbacks and open/update/close methods.

## Options ##

**content**: [HTMLElement || String] [**REQUIRED**] HTMLElement or String which contains all the content for your Modal. 

**modalID**: [String] *Default: random string*. Unique ID for the Modal. If a Modal with the same ID is present, said Modal will open instead.

**container**: [HTMLElement || String] *Default: document.body*. Specify a container for the Modal. Can be an HTMLElement or a selector string.

**keepAlive**: [Boolean] *Default: true*. If set to **false**, the Modal will be removed from the DOM after closing it.

**openImmediately**: [Boolean] *Default: true*. Open the Modal immediately after creating it.

## Callbacks ##

**beforeOpenCallback**: [function] Runs every time before the Modal is opened or updated. If **false** is returned, Modal won't open nor update.

**afterOpenCallback**: [function] Runs every time after the Modal opens.

**afterCloseCallback**: [function] Runs every time after the Modal is closed.

**afterCreateCallback**: [function] Runs once after the Modal is initially created. If keepAlive is **true** it will run every time the Modal opens.

## Methods ##

You can run these on your new Modal instance:

**open**: [or *yourModalElement.modal.open();*]

**close**: [or *yourModalElement.modal.close();*]   
parameters: [None]  

**update**: [or *yourModalElement.modal.update();*]
parameters:   
'content': [String || HTMLElement] HTML string or HTMLElement to update the Modal with.  
'newID': [String] Changes the updated Modal's ID to this value.  

## Usage ##

	var myModal = new Modal({
		modalID:		        'custom-unique-id',
		modalClass: 	        'homepage-modal',
		content: 	            '<p>Content for the Modal here</p>',
		beforeOpenCallback: 	function(modal) {
		                            if (someCondition) {
		                                //Do something.
		                                return true;
		                            }
		                            return false;
		                        }
	});
