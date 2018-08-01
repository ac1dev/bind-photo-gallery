var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, State, Event, Method, Prop } from '@stencil/core';
import pinchit from 'pinchit/dist/pinchit.js';
let Gallery = class Gallery {
    constructor() {
        this.pageWidth = window.innerWidth || document.body.clientWidth;
        this.treshold = Math.max(1, Math.floor(0.01 * (this.pageWidth)));
        this.touchstartX = 0;
        this.touchstartY = 0;
        this.touchendX = 0;
        this.touchendY = 0;
        this.limit = Math.tan(45 * 1.5 / 180 * Math.PI);
        this.gestureZone = this.galleryImageElement;
        this.imagePreviewHideNav = {
            'grid-template-columns': '100%'
        };
        this.hideNavStyle = {
            'display': 'none'
        };
        this.images = [];
        this.imageWrapperStyle = {
            display: 'none'
        };
        this.galleryImageStyle = {};
        this.galleryWrapper = {};
    }
    componentWillLoad() {
    }
    componentDidLoad() {
        this.setImage(0);
        this.galleryImageContainer.addEventListener('touchstart', (event) => {
            this.touchstartX = event['changedTouches'][0].screenX;
            this.touchstartY = event['changedTouches'][0].screenY;
            this.touches = event['touches'].length;
        });
        this.galleryImageContainer.addEventListener('touchend', (event) => {
            let elem = document.getElementById('bc-gallery-image');
            this.touchendX = event['changedTouches'][0].screenX;
            this.touchendY = event['changedTouches'][0].screenY;
            if ((!this.displayGrid && this.touches === 1) && !(elem['style'].transform.includes('-'))) {
                this._handleGesture();
                this.touches = 0;
            }
        });
        pinchit(this.galleryImageContainer);
    }
    setImage(imageIndex) {
        if (imageIndex === this.imageIndex)
            return;
        if (this.displayGrid)
            this.displayGrid = false;
        this.imageIndex = imageIndex;
        this.galleryImage = this.images[imageIndex];
        this.isImageLoading = true;
        this.imageWrapperStyle = { display: 'none' };
        this.onImageChange.emit(imageIndex);
    }
    previousImage() {
        if (this.images.length > 1) {
            if (this.imageIndex === 0) {
                this.setImage(this.images.length - 1);
            }
            else {
                this.setImage(this.imageIndex - 1);
            }
        }
    }
    nextImage() {
        if (this.images.length > 1) {
            if (this.imageIndex !== this.images.length - 1) {
                this.setImage(this.imageIndex + 1);
            }
            else {
                this.setImage(0);
            }
        }
    }
    imageLoaded() {
        this.isImageLoading = false;
        this.imageWrapperStyle = { display: 'initial' };
    }
    openGridGallery() {
        this.displayGrid = true;
    }
    _displayLoadingSpinner() {
        if (this.isImageLoading) {
            return h("div", { class: "lds-roller" },
                h("div", null),
                h("div", null),
                h("div", null),
                h("div", null),
                h("div", null),
                h("div", null),
                h("div", null),
                h("div", null));
        }
    }
    _closeGallery() {
        this.onGalleryClose.emit(false);
    }
    _handleGesture() {
        let x = this.touchendX - this.touchstartX;
        let y = this.touchendY - this.touchstartY;
        let yx = Math.abs(y / x);
        if (Math.abs(x) > this.treshold || Math.abs(y) > this.treshold) {
            // IF left or right
            if (yx <= this.limit) {
                return (x < 0) ? this._goNextImageAnimated() : this._goPreviousImageAnimated();
            }
        }
    }
    _goNextImageAnimated() {
        if (this.images.length > 1) {
            this.galleryImageStyle = {
                '-webkit-animation': 'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
                'animation': 'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
            };
            setTimeout(() => {
                this.nextImage();
                this._clearGalleryImageStyle();
            }, 300);
        }
    }
    _goPreviousImageAnimated() {
        if (this.images.length > 1) {
            this.galleryImageStyle = {
                '-webkit-animation': 'slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
                'animation': 'slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
            };
            setTimeout(() => {
                this.previousImage();
                this._clearGalleryImageStyle();
            }, 300);
        }
    }
    _clearGalleryImageStyle() {
        this.galleryImageStyle = {};
    }
    _renderToolbarGrid() {
        if (this.displayGrid) {
            return h("div", { class: 'bc-gallery-grid-overlay', onClick: () => this.displayGrid = false },
                h("div", { class: 'bc-gallery-grid' }, this.images.map((image, index) => {
                    return h("div", { class: 'bc-grid-image-container', onClick: () => this.setImage(index) },
                        h("img", { class: 'bc-grid-image', src: image.url, alt: "" }));
                })));
        }
        ;
    }
    render() {
        return (h("div", null,
            this._renderToolbarGrid(),
            h("div", { class: 'bc-gallery-wrapper' },
                h("div", { class: 'bc-top-toolbar' },
                    h("div", { class: 'bc-top-left' },
                        h("div", null,
                            h("button", { class: 'bc-grid-button', onClick: () => this.openGridGallery() })),
                        h("div", { class: 'bc-image-number' },
                            this.imageIndex + 1,
                            " / ",
                            this.images.length)),
                    h("div", { class: 'text-right bc-top-right' },
                        h("button", { class: 'bc-close-button', onClick: () => this._closeGallery() }))),
                h("div", { class: 'bc-image-preview', style: this.images.length <= 1 ? this.imagePreviewHideNav : '' },
                    h("div", { class: 'bc-navigation', style: this.images.length <= 1 ? this.hideNavStyle : '', onClick: () => this.previousImage() },
                        h("button", { class: 'bc-navigation-left-button' })),
                    h("div", null,
                        this._displayLoadingSpinner(),
                        h("div", { class: 'bc-image-wrapper', style: this.imageWrapperStyle, ref: element => this.galleryImageContainer = element },
                            h("img", { id: 'bc-gallery-image', class: 'bc-gallery-image', style: this.galleryImageStyle, ref: element => this.galleryImageElement = element, src: this.galleryImage && this.galleryImage.url ? this.galleryImage.url : null, onLoad: () => this.imageLoaded(), alt: "image" }),
                            h("p", { class: 'text-center bc-image-title' },
                                this.galleryImage && this.galleryImage.title ? h("span", null, this.galleryImage.title) : null,
                                this.galleryImage && this.galleryImage.description && this.galleryImage.title ? ' - ' : '',
                                this.galleryImage && this.galleryImage.description ? h("span", null,
                                    " ",
                                    this.galleryImage.description) : null))),
                    h("div", { class: 'bc-navigation', style: this.images.length <= 1 ? this.hideNavStyle : '', onClick: () => this.nextImage() },
                        h("button", { class: 'bc-navigation-right-button' }))))));
    }
};
__decorate([
    Prop()
], Gallery.prototype, "images", void 0);
__decorate([
    Event()
], Gallery.prototype, "onGalleryClose", void 0);
__decorate([
    Event()
], Gallery.prototype, "onImageChange", void 0);
__decorate([
    State()
], Gallery.prototype, "galleryImage", void 0);
__decorate([
    State()
], Gallery.prototype, "imageIndex", void 0);
__decorate([
    State()
], Gallery.prototype, "isImageLoading", void 0);
__decorate([
    State()
], Gallery.prototype, "displayGrid", void 0);
__decorate([
    State()
], Gallery.prototype, "imageWrapperStyle", void 0);
__decorate([
    State()
], Gallery.prototype, "galleryImageStyle", void 0);
__decorate([
    State()
], Gallery.prototype, "galleryWrapper", void 0);
__decorate([
    State()
], Gallery.prototype, "touches", void 0);
__decorate([
    Method()
], Gallery.prototype, "setImage", null);
__decorate([
    Method()
], Gallery.prototype, "previousImage", null);
__decorate([
    Method()
], Gallery.prototype, "nextImage", null);
__decorate([
    Method()
], Gallery.prototype, "imageLoaded", null);
__decorate([
    Method()
], Gallery.prototype, "openGridGallery", null);
Gallery = __decorate([
    Component({
        tag: 'bind-gallery',
        styleUrl: 'gallery.scss',
        shadow: false
    })
], Gallery);
export { Gallery };
