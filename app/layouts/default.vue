<template>
  <div>
    <div class="tablet:flex">
      <!-- 現行の `container column is-half`: 769px 以上で 1/2 幅、中央寄せ。最大幅は幅に応じて段階的に変わる -->
      <div
        class="w-full tablet:mx-auto tablet:w-1/2 tablet:flex-none desktop:max-w-[960px] widescreen:max-w-[1152px] fullhd:max-w-[1344px]"
      >
        <AppHeader />
        <div class="content m-2">
          <slot />
        </div>
        <AppFooter />
      </div>
    </div>
  </div>
</template>
