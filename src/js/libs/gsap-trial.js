// all tools are exported from the "all" file (excluding members-only plugins):
import { gsap, ScrollTrigger, ScrollSmoother } from 'gsap-trial/all.js';

// don't forget to register plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
	wrapper: '.wrapper',
	content: '.wrapper-content',
	smooth: 1.5,
	effects: true,
});
