// ============================================================
// DATA - 10 categories, 5-8 subcategories each
// ============================================================
var CATEGORIES = [
    { name: "Capacitors", icon: "&#9889;", count: 2200, subcats: [
        { name: "Ceramic Capacitors", count: 680 },
        { name: "Aluminum Electrolytic", count: 420 },
        { name: "Film Capacitors", count: 310 },
        { name: "Tantalum Capacitors", count: 250 },
        { name: "Supercapacitors", count: 180 },
        { name: "Polymer Capacitors", count: 160 },
        { name: "Mica Capacitors", count: 100 },
        { name: "Safety Capacitors", count: 100 }
    ]},
    { name: "Resistors", icon: "&#8486;", count: 1800, subcats: [
        { name: "Chip Resistors (SMD)", count: 520 },
        { name: "Through Hole Resistors", count: 380 },
        { name: "Precision Resistors", count: 280 },
        { name: "Power Resistors", count: 220 },
        { name: "Potentiometers", count: 200 },
        { name: "Resistor Networks", count: 200 }
    ]},
    { name: "Semiconductors", icon: "&#9851;", count: 2500, subcats: [
        { name: "Diodes", count: 580 },
        { name: "MOSFETs", count: 520 },
        { name: "BJT Transistors", count: 380 },
        { name: "Voltage Regulators", count: 420 },
        { name: "IGBTs", count: 220 },
        { name: "Thyristors", count: 180 },
        { name: "Rectifiers", count: 200 }
    ]},
    { name: "Integrated Circuits", icon: "&#128187;", count: 3000, subcats: [
        { name: "Microcontrollers", count: 720 },
        { name: "Op-Amps", count: 480 },
        { name: "ADCs / DACs", count: 340 },
        { name: "Logic ICs", count: 520 },
        { name: "Memory ICs", count: 380 },
        { name: "Interface ICs", count: 280 },
        { name: "Clock / Timing ICs", count: 280 }
    ]},
    { name: "Connectors", icon: "&#128268;", count: 2000, subcats: [
        { name: "Board-to-Board", count: 420 },
        { name: "Wire-to-Board", count: 380 },
        { name: "USB Connectors", count: 280 },
        { name: "D-Sub Connectors", count: 220 },
        { name: "Terminal Blocks", count: 340 },
        { name: "Headers & Housings", count: 360 }
    ]},
    { name: "LEDs & Optoelectronics", icon: "&#128161;", count: 1600, subcats: [
        { name: "Standard LEDs", count: 380 },
        { name: "High-Power LEDs", count: 260 },
        { name: "LED Displays", count: 200 },
        { name: "Photodiodes", count: 180 },
        { name: "Optocouplers", count: 300 },
        { name: "IR Emitters", count: 140 },
        { name: "Laser Diodes", count: 140 }
    ]},
    { name: "Inductors & Coils", icon: "&#127744;", count: 1200, subcats: [
        { name: "Fixed Inductors", count: 380 },
        { name: "Power Inductors", count: 300 },
        { name: "RF Inductors", count: 180 },
        { name: "Common Mode Chokes", count: 200 },
        { name: "Ferrite Beads", count: 140 }
    ]},
    { name: "Circuit Protection", icon: "&#128737;", count: 1000, subcats: [
        { name: "Fuses", count: 280 },
        { name: "PTC Resettable Fuses", count: 180 },
        { name: "TVS Diodes", count: 220 },
        { name: "Varistors (MOVs)", count: 160 },
        { name: "ESD Suppressors", count: 160 }
    ]},
    { name: "Development Boards", icon: "&#128295;", count: 800, subcats: [
        { name: "Arduino Boards", count: 140 },
        { name: "Raspberry Pi", count: 100 },
        { name: "ESP32 / ESP8266", count: 180 },
        { name: "STM32 Dev Kits", count: 160 },
        { name: "FPGA Dev Boards", count: 100 },
        { name: "Evaluation Boards", count: 120 }
    ]},
    { name: "Sensors", icon: "&#128225;", count: 1400, subcats: [
        { name: "Temperature Sensors", count: 320 },
        { name: "Pressure Sensors", count: 260 },
        { name: "Current Sensors", count: 220 },
        { name: "Magnetic Sensors", count: 200 },
        { name: "Humidity Sensors", count: 180 },
        { name: "Gas Sensors", count: 120 },
        { name: "Motion Sensors", count: 100 }
    ]}
];

var MANUFACTURERS = [
    "Texas Instruments", "Microchip Technology", "STMicroelectronics", "NXP Semiconductors",
    "Vishay", "Murata", "TE Connectivity", "ON Semiconductor", "Analog Devices",
    "Infineon Technologies", "ROHM", "TDK", "Panasonic", "Yageo", "Bourns", "Littelfuse"
];

var PACKAGES = ["SMD 0402","SMD 0603","SMD 0805","SMD 1206","Through Hole","DIP-8","DIP-14","QFP-48","SOP-8","SOT-23","SOT-223","TO-220","SOIC-8"];
var PACKAGINGS = ["Cut Tape","Tape & Reel","Tube","Tray","Bulk"];
var STATUSES = ["Active","Active","Active","Active","Active","Active","Last Time Buy","Discontinued"];

var CATEGORY_SPECS = {
    "Capacitors": [
        { name: "Capacitance", values: ["1pF","10pF","100pF","1nF","10nF","100nF","1uF","10uF","100uF"] },
        { name: "Voltage Rating", values: ["6.3V","10V","16V","25V","50V","100V","250V"] },
        { name: "Tolerance", values: ["+/-1%","+/-5%","+/-10%","+/-20%"] }
    ],
    "Resistors": [
        { name: "Resistance", values: ["1R","10R","100R","1K","10K","100K","1M"] },
        { name: "Power Rating", values: ["0.1W","0.125W","0.25W","0.5W","1W","2W"] },
        { name: "Tolerance", values: ["+/-0.1%","+/-0.5%","+/-1%","+/-5%"] }
    ],
    "Semiconductors": [
        { name: "Voltage Rating", values: ["20V","30V","60V","100V","200V","600V"] },
        { name: "Current Rating", values: ["0.5A","1A","2A","5A","10A","20A"] },
        { name: "Technology", values: ["Si","SiC","GaN","Schottky","Zener"] }
    ],
    "Integrated Circuits": [
        { name: "Core", values: ["ARM Cortex-M0","ARM Cortex-M3","ARM Cortex-M4","AVR","PIC","RISC-V"] },
        { name: "Flash Size", values: ["16KB","32KB","64KB","128KB","256KB","512KB"] },
        { name: "Speed", values: ["8MHz","16MHz","48MHz","72MHz","120MHz","240MHz"] }
    ]
};

// ============================================================
// STATE
// ============================================================
var inStockOnly = true;
var priceAtQty = 1;
var currentProducts = [];
var compareList = JSON.parse(localStorage.getItem('uro_compare') || '[]');
var currentSort = { field: null, dir: 'asc' };
var currentPage = 1;
var ITEMS_PER_PAGE = 10;
var cart = JSON.parse(localStorage.getItem('uro_cart') || '[]');
var priceBreaksMap = {};
var currentView = 'home';
var currentCatName = null;
var currentSubcatName = null;
var skipPush = false;
var activeFilters = {};  // { specName: [val1, val2], manufacturer: [m1, m2] }

