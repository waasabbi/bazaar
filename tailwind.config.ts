import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
    	// fontSize: {
    	// 	'heading1-bold': [\n				"50px",\n				{\n					lineHeight: "100%",\n					fontWeight: "700",\n				},\n			],
    	// 	'heading2-bold': [\n				"30px",\n				{\n					lineHeight: "100%",\n					fontWeight: "700",\n				},\n			],
    	// 	'heading3-bold': [\n				"24px",\n				{\n					lineHeight: "100%",\n					fontWeight: "700",\n				},\n			],
    	// 	'heading4-bold': [\n				"20px",\n				{\n					lineHeight: "100%",\n					fontWeight: "700",\n				},\n			],
    	// 	'body-bold': [\n				"18px",\n				{\n					lineHeight: "100%",\n					fontWeight: "700",\n				},\n			],
    	// 	'body-semibold': [\n				"18px",\n				{\n					lineHeight: "100%",\n					fontWeight: "600",\n				},\n			],
    	// 	'body-medium': [\n				"18px",\n				{\n					lineHeight: "100%",\n					fontWeight: "500",\n				},\n			],
    	// 	'base-bold': [\n				"16px",\n				{\n					lineHeight: "100%",\n					fontWeight: "600",\n				},\n			],
    	// 	'base-medium': [\n				"16px",\n				{\n					lineHeight: "100%",\n					fontWeight: "500",\n				},\n			]
    	// },
    	extend: {
    		colors: {
    			'white-1': '#F8F8F8',
    			'grey-1': '#616161',
    			'grey-2': '#E5E7EB',
    			'blue-1': '#005EBE',
    			'blue-2': '#E9F5FE',
    			'blue-3': '#F5F7F9',
    			'red-1': '#FF0000'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'collapsible-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-collapsible-content-height)'
    				}
    			},
    			'collapsible-up': {
    				from: {
    					height: 'var(--radix-collapsible-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'collapsible-down': 'collapsible-down 0.2s ease-out',
    			'collapsible-up': 'collapsible-up 0.2s ease-out'
    		}
    	}
    },
	plugins: [],
};
export default config;