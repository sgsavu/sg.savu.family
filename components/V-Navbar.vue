<template>
    <div
        ref="nav"
        class="nav container"
        role="navigation"
        aria-label="main navigation"
    >
        <div
            ref="navSectionsList"
            class="nav__list"
            :style="{ '--sections-length': sections.length }"
        >
            <li
                v-for="(section, key) in sections"
                :key="key"
                ref="navSectionsListSections"
                role="button"
                tabindex="0"
                :class="{
                    nav__list__section: true,
                    'nav__list__section--active': key === currentSection,
                    'nav__list__section--non-active':
                        key !== currentSection && isShowingCurrentSection
                }"
                @click="boss(section.link)"
                @keypress.enter.space.prevent="$scrollTo(section.scrollTo)"
            >
                {{ section.label }}
            </li>
        </div>

        <button
            ref="navMenuButton"
            tabindex="0"
            aria-label="menu button"
            class="nav__menu-button"
            @click="toggleMenu"
            @keypress.space.enter="toggleMenu"
            @pointerenter="hoverAnimation"
            @pointerleave="idleAnimation"
        >
            <MenuIconSVG ref="navMenuButtonSVG" aria-hidden="true" />
        </button>
    </div>
</template>

<script>
import MenuIconSVG from '~/images/menu-icon.svg?inline';

const SVG_SIZE = 20;
const SVG_LINES_PADDING = 5;

export default {
    components: { MenuIconSVG },
    props: { currentSection: { type: Number, required: true, default: 0 } },
    data: () => ({
        prefersReducedMotion: false,
        isMenuActive: false,
        isShowingCurrentSection: false,
        sections: [
            { label: 'CV', link: 'cv.pdf' },
            { label: 'Papers', link: 'https://papers.sgsavu.com' },
            { label: 'Music', link: 'https://music.sgsavu.com' }
        ]
    }),
    mounted() {
        this.prefersReducedMotion = this.$prefersReducedMotion();
        const { nav } = this.$refs;
        const gsap = this.$gsap;

        let prevScrollPosition = 0;
        this.$locomotiveScroll.on('scroll', ({ scroll }) => {
            if (scroll.y < window.innerHeight - window.innerHeight / 2) {
                return gsap.to(nav, { autoAlpha: 1 });
            }
            const scrollingDown = scroll.y - prevScrollPosition > 0;
            prevScrollPosition = scroll.y;

            if (scrollingDown) {
                gsap.to(nav, { autoAlpha: 0 });
            } else {
                gsap.to(nav, { autoAlpha: 1, duration: 0.25 });
            }
        });
    },
    methods: {
        boss(link) {
            window.open(link, '_blank');
        },
        toggleMenu() {
            this.$nuxt.$emit('toggle-menu');
        },
        closeAnimation() {
            const lines = this.$refs.navMenuButtonSVG.children;
            const tl = this.$gsap.timeline({ defaults: { ease: 'back.out' } });
            const { navMenuButton } = this.$refs;
            const line0Attrs = {
                x1: SVG_SIZE - SVG_LINES_PADDING,
                y1: SVG_LINES_PADDING,
                x2: SVG_LINES_PADDING,
                y2: SVG_SIZE - SVG_LINES_PADDING
            };

            const line1Attrs = {
                x1: SVG_LINES_PADDING,
                y1: SVG_LINES_PADDING,
                x2: SVG_SIZE - SVG_LINES_PADDING,
                y2: SVG_SIZE - SVG_LINES_PADDING
            };

            if (this.prefersReducedMotion) {
                tl.to(lines, { opacity: 0 });
                tl.set(lines[0], { attr: line0Attrs });
                tl.set(lines[1], { attr: line1Attrs });
                tl.set(lines, { color: '#030303' });
                tl.set(navMenuButton, { '--bg-scale': '1' }, 0);
                tl.to(lines, { opacity: 1 });
            } else {
                tl.to(lines, { color: '#030303' });
                tl.to(lines[0], { attr: line0Attrs }, 0);
                tl.to(lines[1], { attr: line1Attrs }, '<');
                tl.to(navMenuButton, { '--bg-scale': '1' }, '0.135');
            }
        },
        idleAnimation() {
            if (this.isMenuActive) {
                return;
            }

            const lines = this.$refs.navMenuButtonSVG.children;
            const { navMenuButton } = this.$refs;
            const tl = this.$gsap.timeline({ defaults: { ease: 'back.out' } });
            const line0Attrs = { x1: 0.25, y1: 7.75, x2: 19.75, y2: 7.75 };
            const line1Attrs = { x1: 5.25, y1: 11.75, x2: 19.75, y2: 11.75 };

            if (this.prefersReducedMotion) {
                tl.to(lines, { opacity: 0 });
                tl.set(lines[0], { attr: line0Attrs });
                tl.set(lines[1], { attr: line1Attrs });
                tl.set(lines, { color: '#bababa' });
                tl.set(navMenuButton, { '--bg-scale': '0' });
                tl.to(lines, { opacity: 1 });
            } else {
                tl.to(lines, { color: '#bababa' });
                tl.to(
                    navMenuButton,
                    { '--bg-scale': '0', ease: 'power2.out' },
                    0
                );
                tl.to(lines[0], { attr: line0Attrs }, 0);
                tl.to(lines[1], { attr: line1Attrs }, '<');
            }
        },
        hoverAnimation() {
            if (this.isMenuActive || this.prefersReducedMotion) return;

            const lines = this.$refs.navMenuButtonSVG.children;
            this.$gsap.to(lines, {
                attr: { x1: SVG_LINES_PADDING },
                ease: 'back.out'
            });
        }
    }
};
</script>

<style lang="scss">
.nav {
    color: darken($color: white, $amount: 27);
    padding: 1rem var(--x-padding);
    transition: color 200ms ease;

    pointer-events: none;
    align-items: center;
    position: fixed;
    display: flex;

    justify-content: end;

    z-index: 2;
    top: 1rem;
    left: 0;
    width: 100%;

    &__list {
        list-style-type: none;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        gap: 0.25rem;
        padding: 0;
        margin: 0;

        &__section {
            transition: color 100ms var(--ease-back);
            font-size: var(--step--2);
            pointer-events: all;
            position: relative;
            text-align: right;
            cursor: pointer;

            &::before {
                --size: calc(var(--step--2) - 0.6rem);

                transform: translate(-50%, -50%);
                transition: opacity 100ms ease;
                background-color: #ffe6ed;
                height: var(--size);
                width: var(--size);
                position: absolute;
                border-radius: 50%;
                content: none;
                opacity: 0.75;
                right: 105%;
                opacity: 0;
                top: 50%;

                @media (prefers-reduced-motion: reduce) {
                    content: '';
                }
            }

            &--non-active {
                color: darken($color: white, $amount: 60);
                transition: color 400ms var(--ease-back);
            }

            &--active::before {
                transition: opacity 400ms ease;
                opacity: 1;
            }

            &:is(:hover, :focus) {
                color: white;
                transition: none;
            }
        }

        @media screen and (max-width: 768px) {
            display: none;
        }
    }

    &__menu-button {
        --bg-scale: 0;

        transition: transform 300ms var(--ease-back);
        width: max(var(--step-5), 4rem);
        transform-origin: right center;
        background: transparent;
        pointer-events: all;
        color: currentColor;
        position: relative;
        cursor: pointer;
        border: none;
        height: auto;
        z-index: 1;
        padding: 0;
        margin: 0;

        &:active {
            transform: scale(0.9);
        }

        @media screen and (min-width: 768px) {
            display: none;
        }

        @media (prefers-reduced-motion: reduce) {
            &:active {
                transform: none;
            }
        }

        &::after {
            --size: 120%;

            transform: translate(-50%, -51.5%) scale(var(--bg-scale));
            // transition: transform 400ms;

            background-color: #ffe6ed;
            height: var(--size);
            width: var(--size);
            position: absolute;
            border-radius: 50%;
            content: '';
            z-index: -1;
            left: 50%;
            top: 50%;

            @supports (aspect-ratio: 1/1) {
                aspect-ratio: 1/1;
                height: unset;
            }
        }
    }
}
</style>
