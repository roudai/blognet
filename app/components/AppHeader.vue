<script setup lang="ts">
import { repositoryUrl } from '~/data/site'
</script>

<template>
  <!--
    移植元: legacy/components/NavBar.vue(Bulma の `navbar is-dark p-2`)
    現行にはバーガーボタンがなく、desktop(1024px)未満では navbar-menu(GitHub アイコン)が表示されない。
    パリティのため、同じ挙動にする(specs/001-site-foundation/spec.md の Edge Cases)
  -->
  <nav
    class="bg-bulma-nav p-2 text-white desktop:flex desktop:items-stretch"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="ml-1 flex min-h-13 items-stretch desktop:shrink-0">
      <a href="/" class="flex items-center px-3 py-2 text-white hover:bg-[#292929] hover:text-[#f5f5f5]">
        ブログ版ろーだいねっと アーカイブ
      </a>
    </div>

    <div id="navbarMenu" class="hidden desktop:-mr-3 desktop:flex desktop:shrink-0 desktop:grow desktop:items-stretch">
      <div class="ml-auto desktop:flex desktop:items-stretch">
        <div class="flex items-center px-3 py-2">
          <a :href="repositoryUrl" aria-label="GitHub" class="text-white">
            <IconGithub fill="white" class="mr-2" />
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>
