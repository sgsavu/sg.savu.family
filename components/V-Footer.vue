<template>
    <footer ref="footer" class="footer">
        <div ref="footerWrapper" class="footer__wrapper" data-scroll-sticky>
            <div ref="footerContent" class="footer__content">
                <div></div>
                <div class="footer__content__social">
                    <li
                        v-for="(link, key) in socialLinks"
                        :key="key"
                        class="footer__content__social__link"
                    >
                        <V-Footer-Social-Link
                            ref="footerContentSocialLinks"
                            v-hoverable
                            target="_blank"
                            :href="link.href"
                            :aria-label="`link to ${link.label}`"
                        >
                            {{ link.label }}
                        </V-Footer-Social-Link>
                    </li>
                </div>
            </div>
            <div
                class="footer__arrow__wrapper"
                role="button"
                aria-label="scroll to top"
                tabindex="0"
                @click="$scrollTo(0)"
            >
                <ArrowUpSVG aria-label="up arrow" class="footer__arrow" />
            </div>
        </div>
    </footer>
</template>

<script>
import ArrowUpSVG from '~/images/arrow/up.svg?inline';

export default {
    components: { ArrowUpSVG },
    data: () => ({
        socialLinks: [
            {
                label: 'linkedin',
                href: 'https://www.linkedin.com/in/sebastian-gabriel-savu/'
            },
            {
                label: 'github',
                href: 'https://github.com/sgsavu'
            },
            {
                label: 'email',
                href: 'mailto:armenz_savu@yahoo.com'
            }
        ]
    }),
    mounted() {
        const { footerWrapper } = this.$refs;

        const resizeObserver = new ResizeObserver(
            this.setFooterWrapperHeightVar
        );

        resizeObserver.observe(footerWrapper);
        this.setFooterWrapperHeightVar();
    },
    methods: {
        setFooterWrapperHeightVar() {
            this.$gsap.set(this.$refs.footer, {
                '--wrapper-height': `${this.$refs.footerWrapper.offsetHeight}px`,
                onEnd: () => this.$locomotiveScroll.update()
            });
        }
    }
};
</script>

<style lang="scss">
@use 'sass:color';

@mixin visible-after {
    position: absolute;
    content: '';
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;

    @media (prefers-reduced-motion: reduce) {
        content: none;
    }
}

.footer {
    height: var(--wrapper-height);
    overflow: hidden;

    &__wrapper {
        justify-content: flex-start;
        align-items: stretch;
        pointer-events: all;
        flex-wrap: wrap;
        position: fixed;
        display: flex;
        z-index: -1;
        bottom: 0;
        right: 0;
        left: 0;
    }

    &__content {
        --secondary-color: #{color.adjust($color: #fff, $lightness: -25%)};
        grid-template-columns: repeat(2, 1fr);
        padding: 2rem clamp(1rem, 4vw, 5rem) 3rem;
        background: var(--black-color);
        align-items: center;
        position: relative;
        color: whitesmoke;
        flex-basis: 80%;
        display: grid;
        flex-grow: 1;
        gap: 1.5rem;
        width: 100%;

        & > *:nth-child(even) {
            justify-self: end;
            text-align: right;
        }

        &__social {
            padding-inline-start: 0;
            list-style-type: none;
            margin: 0;

            &__link {
                margin: 1rem 0;

                a {
                    font-size: calc(var(--step--2) + 0.1rem);
                    text-transform: uppercase;
                    text-decoration: none;
                    color: whitesmoke;
                }
            }
        }

        &::after {
            background-color: rgba($color: white, $alpha: 0.125);
            position: absolute;
            content: '';
            width: 1px;
            bottom: 0;
            right: 0;
            top: 0;
        }

        @media screen and (max-width: 600px) {
            grid-template-rows: repeat(4, fit-content);
            grid-template-columns: 1fr;

            & > * {
                justify-self: center !important;
                text-align: center !important;
            }
        }
    }

    &__arrow {
        transition: transform 300ms, opacity 300ms;
        color: darken($color: white, $amount: 40);
        max-width: min(15vw, 130px);
        height: auto;
        width: 40%;

        &__wrapper {
            background: var(--black-color);
            justify-content: center;
            align-items: center;
            min-width: 115px;
            cursor: pointer;
            flex-basis: 20%;
            display: flex;
            flex-grow: 1;

            &:is(:focus, :hover) {
                svg {
                    transform: scale(0.9) translateY(-15px);
                    opacity: 0.75;
                }
            }
        }

        @media screen and (max-width: 575px) {
            min-height: 30vw;
            color: whitesmoke;
        }
    }
}
</style>
