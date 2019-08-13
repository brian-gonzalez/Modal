'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bornUtilities = require('@borngroup/born-utilities');

var _bodyScrollLock = require('body-scroll-lock');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Modal = function () {
    function Modal(options) {
        _classCallCheck(this, Modal);

        this.options = options || {};

        //Options
        this.options.modalID = this.options.modalID || 'auto-' + Math.floor(new Date().getTime() * Math.random()).toString();
        this.options.modalClass = 'window-modal ' + (this.options.modalClass || '');
        this.options.openImmediately = this.options.hasOwnProperty('openImmediately') ? this.options.openImmediately : true;
        this.options.allowEscClose = this.options.hasOwnProperty('allowEscClose') ? this.options.allowEscClose : true;
        this.options.allowClickOutClose = this.options.hasOwnProperty('allowClickOutClose') ? this.options.allowClickOutClose : true;
        this.options.allowCrossClose = this.options.hasOwnProperty('allowCrossClose') ? this.options.allowCrossClose : true;

        this._modalContentClass = 'window-modal__content';

        if (typeof this.options.container === 'string') {
            this.options.container = document.querySelector(this.options.container);
        } else if (this.options.container instanceof HTMLElement) {
            this.options.container = this.options.container;
        } else {
            this.options.container = document.querySelector('body');
        }

        //If modal doesn't exist, create it.
        if (!Modal.getModal(this.options.modalID)) {
            this._renderModal();
        } else {
            //Otherwise, just open it.
            Modal.openModal(this.options.modalID);
        }
    }

    /**
     * Creates the modal
     */


    _createClass(Modal, [{
        key: '_renderModal',
        value: function _renderModal() {
            var _this = this;

            this.modalEl = (0, _bornUtilities.createElWithAttrs)(false, { 'id': 'modal-' + this.options.modalID, 'class': this.options.modalClass, 'data-modal': true });

            this.modalEl.modal = {};

            this.modalEl.modal.content = (0, _bornUtilities.createElWithAttrs)(this.modalEl, { 'class': this._modalContentClass, 'tabindex': '-1' });
            this.modalEl.modal.options = this.options;
            this.modalEl.modal.container = this.options.container;

            this.modalEl.modal.keepAlive = this.options.hasOwnProperty('keepAlive') ? this.options.keepAlive : true;

            //Callbacks
            this.modalEl.modal.beforeOpenCallback = this.options.beforeOpenCallback || function () {
                return true;
            };
            this.modalEl.modal.afterOpenCallback = this.options.afterOpenCallback || function () {};
            this.modalEl.modal.beforeCloseCallback = this.options.beforeCloseCallback || function () {
                return true;
            };
            this.modalEl.modal.afterCloseCallback = this.options.afterCloseCallback || function () {};
            this.modalEl.modal.afterCreateCallback = this.options.afterCreateCallback || function () {};

            //Methods
            this.open = this.modalEl.modal.open = Modal.openModal.bind(Modal, this.modalEl);
            this.close = this.modalEl.modal.close = Modal.closeModal;
            this.update = this.modalEl.modal.update = Modal.updateModal.bind(Modal, this.modalEl);

            if (this.options.content) {
                Modal.insertContent(this.modalEl, this.options.content);
            }

            this.options.container.appendChild(this.modalEl);

            //Checks to see if modal has been succesfully inserted in DOM before attempting to open it.
            var checkReadyTries = 0,
                checkReady = setInterval(function () {

                checkReadyTries++;

                if (Modal.getModal(_this.options.modalID)) {
                    clearInterval(checkReady);

                    _this.modalEl.modal.afterCreateCallback(_this.modalEl);

                    if (_this.options.allowCrossClose) {
                        Modal.insertCloseBtn(_this.modalEl.modal.content);
                    }

                    if (_this.options.openImmediately) {
                        Modal.openModal(_this.modalEl);
                    }

                    _this.modalEl.modal.options.customAttributes = (0, _bornUtilities.objectAssign)(_this.getCustomAttributes(_this.modalEl), _this.modalEl.modal.options.customAttributes);

                    Modal.updateAttributes(_this.modalEl);
                } else if (checkReadyTries >= 25) {
                    clearInterval(checkReady);
                }
            }, 10);
        }
    }, {
        key: 'getCustomAttributes',


        /**
         * Setup custom HTML attributes for the modal.
         * Default to setting a few aria-attributes to give more context to the browser.
         * @param  {[type]} trigger [description]
         * @return {[type]}         [description]
         */
        value: function getCustomAttributes(targetModal) {
            var labeledByEl = targetModal.querySelector('[data-modal-component="labeledby"]'),
                describedByEl = targetModal.querySelector('[data-modal-component="describedby"]');

            //`value`: [String | Array] If Array, index 0 is used when Toggle is unset, and index 1 is used when it's set.
            //`trigger`: [Boolean] Set to true to only attach the attribute to the trigger element.
            //`target`: [Boolean] Set to true to only attach the attribute to the target element.
            return {
                'role': {
                    value: 'dialog',
                    target: true
                },
                'aria-labeledby': labeledByEl ? { value: labeledByEl.id, target: true } : false,
                'aria-describedby': describedByEl ? { value: describedByEl.id, target: true } : false,
                'aria-modal': {
                    value: 'true',
                    target: true
                }
            };
        }

        /**
         * Loop through the `targetModal.modal.options.customAttributes` object and update the configured attributes.
         * This method is also called whenever the Modal is shown or hidden, in case the attributes should change.
         * @param  {[type]}  modal  [description]
         * @param  {Boolean} isActive [description]
         * @return {[type]}           [description]
         */

    }], [{
        key: 'setModalPosition',
        value: function setModalPosition() {
            Modal.positionTop = Math.abs(document.body.getBoundingClientRect().top);
        }
    }, {
        key: 'toggleModalScroll',
        value: function toggleModalScroll(targetModal, disable) {
            var scrollableEls = targetModal.querySelectorAll('[data-modal-scrollable]'),
                toggleBodyScroll = disable ? _bodyScrollLock.disableBodyScroll : _bodyScrollLock.enableBodyScroll,
                scrollOptions = disable ? {
                allowTouchMove: function allowTouchMove(el) {
                    while (el && el !== document.body) {
                        if (el.hasAttribute('data-modal-scrollable')) {
                            return true;
                        }

                        el = el.parentNode;
                    }
                }
            } : {};

            toggleBodyScroll(targetModal, scrollOptions);
            //This is a hacky way to force a browser repaint because for some reason they need this.
            targetModal.scrollHeight;
        }
    }, {
        key: 'setModalShown',
        value: function setModalShown() {
            //Prevent modals from getting scroll-locked in case `disableBodyScroll()` had been called before.
            (0, _bodyScrollLock.clearAllBodyScrollLocks)();

            //Only add these classes/states if the modal is active.
            //This prevents locking the viewport when user promptly closes modal before it's done animating.
            if (this.classList.contains('modal-active')) {
                if (this.modal.options.lockViewport) {
                    document.documentElement.classList.add('cancel-scroll');
                } else {
                    Modal.toggleModalScroll(this, true);
                }

                this.modal.container.classList.add('modal-shown');
            }

            Modal.setFocusTrap(this);

            this.removeEventListener((0, _bornUtilities.whichTransition)(), Modal.setModalShown);
        }

        /**
         * Opens referenced modal
         * @param  {[HTMLElement || String]} targetModal [targetModal element or ID to be opened]
         */

    }, {
        key: 'openModal',
        value: function openModal(targetModal) {
            var activeModal = Modal.getActiveModal();

            targetModal = Modal.getModal(targetModal);

            if (targetModal.modal.beforeOpenCallback(targetModal)) {
                //Add modal index every time a modal is opened. This can be used to determine the priority order of the modals.
                var targetModalIndex = activeModal ? parseInt(activeModal.getAttribute('data-modal-index')) + 1 : 0;

                targetModal.setAttribute('data-modal-index', targetModalIndex);

                Modal.setModalPosition();

                if (!targetModal.modal.options.overlayOthers) {
                    Modal.closeAllModals();
                } else if (activeModal) {
                    targetModal.modal.modalInBackground = activeModal;
                    activeModal.classList.add('modal-in-background');
                }

                targetModal.addEventListener('click', Modal.closeModal);

                if (targetModal.modal.options.allowEscClose) {
                    document.body.addEventListener('keydown', Modal.closeModal);
                }

                targetModal.classList.add('modal-active');

                targetModal.addEventListener((0, _bornUtilities.whichTransition)(), Modal.setModalShown);

                Modal.toggleVideo(targetModal, 'play');

                //If option is specified, closes the modal after `timeOut`.
                if (targetModal.modal.options.timeOut) {
                    window.setTimeout(Modal.closeModal, targetModal.modal.options.timeOut);
                }

                //Run this when eerything's in place
                targetModal.modal.afterOpenCallback(targetModal);
            }
        }
    }, {
        key: 'updateAttributes',
        value: function updateAttributes(targetModal, isActive) {
            var customAttributes = targetModal.modal.options.customAttributes;

            for (var attrKey in customAttributes) {
                if (customAttributes[attrKey]) {
                    if (customAttributes[attrKey].trigger) {
                        // Modal.setAttributeValue(trigger, attrKey, customAttributes[attrKey], isActive);
                    } else if (customAttributes[attrKey].target) {
                        Modal.setAttributeValue(targetModal.modal.content, attrKey, customAttributes[attrKey], isActive);
                    } else {
                        // Modal.setAttributeValue(trigger, attrKey, customAttributes[attrKey], isActive);
                        Modal.setAttributeValue(targetModal.modal.content, attrKey, customAttributes[attrKey], isActive);
                    }
                }
            }
        }

        /**
         * Updates a single Toggle element with the custom attributes provided in `attrName` and `attrObject`
         * Set the `isActive` argument to TRUE to swap the attribute value when `attrObject.value` is an Array.
         */

    }, {
        key: 'setAttributeValue',
        value: function setAttributeValue(el, attrName, attrObject, isActive) {
            var value = typeof attrObject.value === 'string' ? attrObject.value : isActive ? attrObject.value[1] : attrObject.value[0];

            el.setAttribute(attrName, value);
        }

        /**
         * Sets up a focus trap when a modal is open.
         * @param {[type]} targetModal [description]
         */

    }, {
        key: 'setFocusTrap',
        value: function setFocusTrap(targetModal) {
            targetModal.modal.focusable = {};
            targetModal.modal.focusable.list = Modal.getFocusableElements(targetModal);
            targetModal.modal.focusable.first = targetModal.modal.focusable.list[0];
            targetModal.modal.focusable.last = targetModal.modal.focusable.list[targetModal.modal.focusable.list.length - 1];

            targetModal.modal.content.focus();
            targetModal.modal.content.style.outline = 'none';

            targetModal.modal.focusable.first.addEventListener('keydown', Modal.loopFocusableNode);
            targetModal.modal.focusable.last.addEventListener('keydown', Modal.loopFocusableNode);
        }

        /**
         * Detect wether the currently focused element is first or last within the modal.
         * Then redirects the focus to the first or last element, depending on the user's tab action.
         */

    }, {
        key: 'loopFocusableNode',
        value: function loopFocusableNode(evt) {
            var focusableObject = this.closest('[data-modal]').modal.focusable,
                isFocusableLast = focusableObject.last === this,
                focusableTarget = focusableObject[isFocusableLast ? 'first' : 'last'];

            if (evt.keyCode === 9 && (isFocusableLast && !evt.shiftKey || !isFocusableLast && evt.shiftKey)) {
                evt.preventDefault();

                focusableTarget.focus();
            }
        }

        /**
         * Replaces modal's ID and content with the provided values
         */

    }, {
        key: 'updateModal',
        value: function updateModal(targetModal, content, newID) {
            targetModal = Modal.getModal(targetModal);

            var targetModalContent = targetModal.querySelector('.window-modal__content');

            if (targetModal.modal.beforeOpenCallback(targetModal)) {
                if (newID) {
                    targetModal.id = 'modal-' + newID;
                }

                if (content) {
                    targetModalContent.innerHTML = '';

                    Modal.insertContent(targetModal, content);
                    Modal.insertCloseBtn(targetModalContent);
                }

                //Run this when everything's in place
                targetModal.modal.afterCreateCallback(targetModal);
                targetModal.modal.afterOpenCallback(targetModal);
            }
        }

        /**
         * If a video is found within the modal, run the 'action' provided.
         */

    }, {
        key: 'toggleVideo',
        value: function toggleVideo(targetModal, action) {
            if (targetModal.modal.options.playVideos && targetModal.querySelector('video')) {
                targetModal.querySelector('video')[action]();
            }
        }

        /**
         * Loops through active modals and closes them all.
         * @return {[type]} [description]
         */

    }, {
        key: 'closeAllModals',
        value: function closeAllModals() {
            var activeModals = Modal.getActiveModals();

            [].forEach.call(activeModals, function (currentModal) {
                Modal.closeModal(false, true);
            });
        }

        /**
         * [closeModal method to... You guessed it, close modals!]
         * @param  {[object]} e [event]
         */

    }, {
        key: 'closeModal',
        value: function closeModal(evt, ignoreBeforeCallback) {
            var targetModal = Modal.getActiveModal(),
                canClose = true,
                isCloseTarget = void 0,
                isCloseAllTarget = void 0,
                wasClick = void 0,
                wasEsc = void 0;

            if (!targetModal) {
                return;
            }

            if ((typeof evt === 'undefined' ? 'undefined' : _typeof(evt)) === 'object') {
                isCloseTarget = evt.target.hasAttribute('data-modal-close');
                isCloseAllTarget = evt.target.hasAttribute('data-modal-close-all');
                wasClick = evt.type === 'click' && (evt.target === targetModal && targetModal.modal.options.allowClickOutClose || isCloseTarget || isCloseAllTarget);
                wasEsc = document.activeElement.tagName !== 'INPUT' && evt.keyCode === 27;

                canClose = wasClick || wasEsc;
            }

            //Check beforeCloseCallback before attempting to close the modal.
            //If ignoreBeforeCallback is provided, ignore beforeCloseCallback.
            if (canClose && (ignoreBeforeCallback || targetModal.modal.beforeCloseCallback(targetModal))) {
                var activeModals = Modal.getActiveModals();

                targetModal.removeEventListener('click', Modal.closeModal);

                //Only remove listeners and class if there is 1 modal or less left.
                if (activeModals.length <= 1) {
                    document.body.removeEventListener('keydown', Modal.closeModal);
                    document.documentElement.classList.remove('cancel-scroll');
                    window.scrollTo(0, Modal.positionTop || 0);
                } else if (targetModal.modal.options.closeAll || isCloseAllTarget) {
                    //If user clicked on an element with `data-modal-close-all`,
                    //or if the modal being closed has the `closeAll` option, close all remaining modals.
                    Modal.closeAllModals();
                }

                targetModal.classList.remove('modal-active');
                Modal.toggleVideo(targetModal, 'pause');

                if (!targetModal.modal.options.lockViewport) {
                    Modal.toggleModalScroll(targetModal);
                }

                //Optionally set the focus back to a specified `afterCloseFocusEl` element.
                //However only focus on it if at the time of closing the modal, the user was focusing an element within the modal.
                //This is necessary to prevent re-assigning focus when it was already intentionally shifted somewhere else.
                //i.e. a user hits "add to cart" which closes the modal and somewhere else in the code the focus is assigned to a minicart.
                if (targetModal.modal.options.afterCloseFocusEl && targetModal.contains(document.activeElement)) {
                    targetModal.modal.options.afterCloseFocusEl.focus();
                }

                //Only remove the container's modal-shown class if the current modal has no modal in background,
                //or if the current modal's container is different than the background modal's.
                if (!targetModal.modal.modalInBackground || targetModal.modal.modalInBackground.modal.container !== targetModal.modal.container) {
                    targetModal.modal.container.classList.remove('modal-shown');
                }

                //Remove the modal-in-background class from the backgrounded modal if it exists.
                if (targetModal.modal.modalInBackground) {
                    //Reset the scroll locking on backgrounded modals if they did not have the `lockViewport` option.
                    if (!targetModal.modal.modalInBackground.modal.options.lockViewport) {
                        Modal.toggleModalScroll(targetModal.modal.modalInBackground, true);
                    }

                    targetModal.modal.modalInBackground.classList.remove('modal-in-background');
                }

                if (!targetModal.modal.keepAlive) {
                    targetModal.addEventListener((0, _bornUtilities.whichTransition)(), Modal.destroyModal);
                }

                targetModal.modal.afterCloseCallback(targetModal);
            }
        }
    }, {
        key: 'destroyModal',
        value: function destroyModal() {
            var targetModal = this || Modal.getActiveModal();

            targetModal.removeEventListener((0, _bornUtilities.whichTransition)(), Modal.destroyModal);
            targetModal.parentNode.removeChild(targetModal);
        }

        //Inserts close button into modal

    }, {
        key: 'insertCloseBtn',
        value: function insertCloseBtn(targetModal) {
            return (0, _bornUtilities.createElWithAttrs)(targetModal, { 'class': 'window-modal__close', 'data-modal-close': true, 'title': 'Close' }, 'button');
        }

        //Adds modal content depending as a string or as a node.

    }, {
        key: 'insertContent',
        value: function insertContent(targetModal, content) {
            if (typeof content === 'string') {
                targetModal.modal.content.insertAdjacentHTML('afterbegin', content);
            } else if (content instanceof HTMLElement) {
                targetModal.modal.content.appendChild(content);
            }
        }

        /**
         * Gets all the currently active modals.
         * @return {NodeList}
         */

    }, {
        key: 'getActiveModals',
        value: function getActiveModals() {
            return document.querySelectorAll('.window-modal.modal-active');
        }

        /**
         * Gets the active modal higher in the display.
         * @return {NodeList}
         */

    }, {
        key: 'getActiveModal',
        value: function getActiveModal() {
            var activeModals = Modal.getActiveModals();

            //THIS SHOULD BE CHANGED TO GET THE HIGHEST INDEX FROM CURRENTLY VISIBLE MODALS.
            return activeModals[activeModals.length - 1];
        }

        /**
         * Returns Modal NodeElement if the passed ID matches a modal.
         * @return {HTMLElement}
         */

    }, {
        key: 'getModal',
        value: function getModal(targetModal) {
            var matchedModal = typeof targetModal === 'string' ? document.querySelector('#modal-' + targetModal) || document.querySelector(targetModal) : false;

            if (matchedModal) {
                return matchedModal;
            } else if (targetModal instanceof HTMLElement) {
                //Return itself if the 'targetModal' is an HTML element.
                //Intentionally empty
                return targetModal;
            } else {
                //targetModal is not a string nor an HTMLElement, return false.
                return false;
            }
        }
    }, {
        key: 'getFocusableElements',
        value: function getFocusableElements(targetModal) {
            return targetModal.querySelectorAll('a, button, input:not([type="hidden"]), select, textarea');
        }
    }]);

    return Modal;
}();

exports.default = Modal;
