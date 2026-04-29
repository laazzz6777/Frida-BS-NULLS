//V66 MENU PROD

const base = Module.findBaseAddress("libg.so");

const GameButton_GameButton = new NativeFunction(base.add(0x57A84C), "void", ["pointer"]);
const ResourceListener_addFile = new NativeFunction(base.add(0xC1E864), 'void',['pointer','pointer','pointer']);
const CustomButton_buttonPressed = base.add(0xBD8AF8);
const stringctor = new NativeFunction(base.add(0xD525A0), "pointer", ["pointer", "pointer"]);
const StringTable_getMovieClip = new NativeFunction(base.add(0xB79B3C), "pointer", ["pointer", "pointer"]);
const Stage_addChild = new NativeFunction(base.add(0xBBF958), "pointer", ["pointer", "pointer"]);
const TextField_setText = new NativeFunction(base.add(0x57AE9C), "pointer", ["pointer", "pointer", "bool"]);
const DisplayObject_setPixelSnappedXY = new NativeFunction(base.add(0xBA2284), "void", ["pointer", "float", "float"]);
const dropGUIContainer_DropGUIContainer = new NativeFunction(base.add(0x57BC80), 'void', ['pointer', 'pointer']);
const Sprite_Sprite = new NativeFunction(base.add(0xBB7148), "void", ["pointer", "int"]);
const GameMain_loadAsset = new NativeFunction(base.add(0x49E11C), 'pointer', ['pointer', 'int']);
const GotoAndStop = new NativeFunction(base.add(0xBA6E6C), 'void', ['pointer', 'int']);
const movieClip_setText = new NativeFunction(base.add(0xBD98BC), "void", ["pointer", "pointer", "pointer"]);

const Stage_Instance = base.add(0x11AAD20);

function strPtr(str) {
    return Memory.allocUtf8String(str);
}

function scPtr(str) {
    var pointer = Memory.alloc(32);
    stringctor(pointer, strPtr(str));
    return pointer;
}

let button = null;

function debug_button() {
    GameMain_loadAsset(scPtr("sc/debug.sc"), 0);
    const movieClip = StringTable_getMovieClip(strPtr("sc/debug.sc"), strPtr("debug_button"));

    button = Memory.alloc(528);
    GameButton_GameButton(button);

    const vtable = button.readPointer();
    new NativeFunction(vtable.add(360).readPointer(), 'void', ['pointer', 'pointer', 'bool'])(button, movieClip, 1);
        
    TextField_setText(button, scPtr("D"), 1);
    DisplayObject_setPixelSnappedXY(button, 0, 560);

    button.add(78).writeU8(1);
    Stage_addChild(Stage_Instance.readPointer(), button);
}

setTimeout(debug_button, 2000);

let category = null;

function debug_category() {
    category = Memory.alloc(528);
    GameButton_GameButton(category);

    const movieClip = StringTable_getMovieClip(strPtr("sc/debug.sc"), strPtr("debug_menu_category"));
    GotoAndStop(movieClip, 1);

    const vtable = category.readPointer();
    new NativeFunction(vtable.add(360).readPointer(), 'void', ['pointer', 'pointer', 'bool'])(category, movieClip, 1);

    TextField_setText(category, scPtr("ok poulet"), 1);
    DisplayObject_setPixelSnappedXY(category, 200, 200);

    Stage_addChild(Stage_Instance.readPointer(), category);
}

let menu = null;

function debug_menu() {
    if (menu !== null) {
        let visible = menu.add(78).readU8();
        menu.add(78).writeU8(visible === 1 ? 0 : 1);
        return;
    }

    menu = Memory.alloc(528);

    const movieClip = StringTable_getMovieClip(strPtr("sc/debug.sc"), strPtr("debug_menu"));
    Sprite_Sprite(menu, 1);

    dropGUIContainer_DropGUIContainer(menu, movieClip);
    DisplayObject_setPixelSnappedXY(menu, 1160, 0);

    menu.add(78).writeU8(1); 

    debug_category();
    Stage_addChild(Stage_Instance.readPointer(), menu);
}

Interceptor.attach(CustomButton_buttonPressed, {
    onEnter(args) {
        if (button && args[0].equals(button)) {
            debug_menu();
        }
    }
});