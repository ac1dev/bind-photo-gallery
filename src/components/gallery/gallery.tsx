import { Component, State, Event, EventEmitter, Method, Prop } from '@stencil/core';
import { image } from './interfaces/interfaces';
import pinchit from 'pinchit/dist/pinchit.js';

@Component({
  tag: 'bind-gallery',
  styleUrl: 'gallery.scss',
  shadow: false
})
export class Gallery {

  public pageWidth: number = window.innerWidth || document.body.clientWidth;
  public treshold: number = Math.max(1, Math.floor(0.01 * (this.pageWidth)));
  public touchstartX: number = 0;
  public touchstartY: number = 0;
  public touchendX: number = 0;
  public touchendY: number = 0;

  public limit: number = Math.tan(45 * 1.5 / 180 * Math.PI);

  public galleryImageContainer: HTMLElement;
  public galleryImageElement: HTMLElement;
  public gestureZone = this.galleryImageElement;

  public imagePreviewHideNav: any = {
    'grid-template-columns': '100%'
  };

  public hideNavStyle: any = {
    'display': 'none'
  };

  @Prop() public images: Array<image> = [];
  @Prop() public closeButton: boolean = false;

  @Event() onGalleryClose: EventEmitter;
  @Event() onImageChange: EventEmitter<number>;


  @State() public galleryImage: image;
  @State() public imageIndex: number;
  @State() public isImageLoading: boolean;
  @State() public displayGrid: boolean;

  @State() public imageWrapperStyle: any = {
    display: 'none'
  };

  @State() public galleryImageStyle: any = {};

  @State() public galleryWrapper: any = {};

  @State() public touches: number;

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

  @Method()
  public setImage(imageIndex: number): void {
    if (imageIndex === this.imageIndex) return;
    if (this.displayGrid) this.displayGrid = false;

    this.imageIndex = imageIndex;
    this.galleryImage = this.images[imageIndex];
    this.isImageLoading = true;
    this.imageWrapperStyle = { display: 'none' };
    this.onImageChange.emit(imageIndex);
  }

  @Method()
  public previousImage(): void {
    if (this.images.length > 1) {

      if (this.imageIndex === 0) {
        this.setImage(this.images.length - 1)
      } else {
        this.setImage(this.imageIndex - 1);
      }
    }
  }

  @Method()
  public nextImage(): void {
    if (this.images.length > 1) {

      if (this.imageIndex !== this.images.length - 1) {
        this.setImage(this.imageIndex + 1)
      } else {
        this.setImage(0);
      }
    }
  }

  @Method()
  public imageLoaded(): void {
    this.isImageLoading = false;
    this.imageWrapperStyle = { display: 'initial' };
  }

  @Method()
  public openGridGallery(): void {
    this.displayGrid = true;
  }

  private _displayLoadingSpinner(): any {
    if (this.isImageLoading) {
      return <div class="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    }
  }

  private _closeGallery(): void {
    this.onGalleryClose.emit(false);
  }

  private _handleGesture(): any {
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

  private _goNextImageAnimated(): void {
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

  private _goPreviousImageAnimated(): void {
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

  private _clearGalleryImageStyle(): void {
    this.galleryImageStyle = {};
  }

  private _renderToolbarGrid(): any {
    if (this.displayGrid) {
      return <div class='bc-gallery-grid-overlay' onClick={() => this.displayGrid = false}>
        <div class='bc-gallery-grid'>
          {
            this.images.map((image, index) => {
              return <div class='bc-grid-image-container' onClick={() => this.setImage(index)}><img
                class='bc-grid-image' src={image.url} alt="" /></div>
            })
          }
        </div>
      </div>
    }
    ;
  }

  private _renderCloseButton(): any {
    if (this.closeButton) {
      return <div class='text-right bc-top-right'>
        <button class='bc-close-button' onClick={() => this._closeGallery()}></button>
      </div>
    } else {
      return <div></div>
    }
  }

  private _renderGridButton(): any {
    if (this.images.length >= 2) {
      return <div>
        <button class='bc-grid-button' onClick={() => this.openGridGallery()}></button>
      </div>
    } else {
      return <div></div>
    }
  }

  private _renderImagesNumber(): any {
    if (this.images.length >= 2) {
      return <div>
        <div class='bc-image-number'>{this.imageIndex + 1} / {this.images.length}</div>
      </div>
    } else {
      return <div></div>
    }
  }

  render() {

    return (
      <div>
        {this._renderToolbarGrid()}

        <div class='bc-gallery-wrapper'>
          <div class='bc-top-toolbar'>
            <div class='bc-top-left'>
              {this._renderGridButton()}
              {this._renderImagesNumber()}
              {this._renderCloseButton()}
            </div>
          </div>

          <div class='bc-image-preview' style={this.images.length <= 1 ? this.imagePreviewHideNav : ''}>
            <div class='bc-navigation' style={this.images.length <= 1 ? this.hideNavStyle : ''} onClick={() => this.previousImage()}>
              <button class='bc-navigation-left-button'></button>
            </div>

            <div>
              {this._displayLoadingSpinner()}
              <div class='bc-image-wrapper' style={this.imageWrapperStyle}
                ref={element => this.galleryImageContainer = element}>
                <img id='bc-gallery-image' class='bc-gallery-image' style={this.galleryImageStyle}
                  ref={element => this.galleryImageElement = element}
                  src={this.galleryImage && this.galleryImage.url ? this.galleryImage.url : null}
                  onLoad={() => this.imageLoaded()}
                  alt="image" />

                <p class='text-center bc-image-title'>
                  {this.galleryImage && this.galleryImage.title ? <span>{this.galleryImage.title}</span> : null}
                  {this.galleryImage && this.galleryImage.description && this.galleryImage.title ? ' - ' : ''}
                  {this.galleryImage && this.galleryImage.description ? <span> {this.galleryImage.description}</span> : null}
                </p>
              </div>
            </div>

            <div class='bc-navigation' style={this.images.length <= 1 ? this.hideNavStyle : ''} onClick={() => this.nextImage()}>
              <button class='bc-navigation-right-button'></button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
