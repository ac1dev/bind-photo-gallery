var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TestWindow } from '@stencil/core/testing';
import { Gallery } from './gallery';
describe('bind-gallery', () => {
    it('should build', () => {
        expect(new Gallery()).toBeTruthy();
    });
    describe('rendering', () => {
        let element;
        let testWindow;
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            testWindow = new TestWindow();
            element = yield testWindow.load({
                components: [Gallery],
                html: '<bind-gallery></bind-gallery>'
            });
        }));
        it('should work without parameters', () => {
            expect(element.textContent.trim()).toEqual('Hello, World! I\'m');
        });
        it('should work with a first name', () => __awaiter(this, void 0, void 0, function* () {
            element.first = 'Peter';
            yield testWindow.flush();
            expect(element.textContent.trim()).toEqual('Hello, World! I\'m Peter');
        }));
        it('should work with a last name', () => __awaiter(this, void 0, void 0, function* () {
            element.last = 'Parker';
            yield testWindow.flush();
            expect(element.textContent.trim()).toEqual('Hello, World! I\'m  Parker');
        }));
        it('should work with both a first and a last name', () => __awaiter(this, void 0, void 0, function* () {
            element.first = 'Peter';
            element.last = 'Parker';
            yield testWindow.flush();
            expect(element.textContent.trim()).toEqual('Hello, World! I\'m Peter Parker');
        }));
    });
});
