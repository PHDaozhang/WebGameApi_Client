// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateTitle(title) {
  if(title.indexOf("system_") > -1 ){
    const hasKey = this.$te('systemRoute.' + title)
    if (hasKey) {
      // $t :this method from vue-i18n, inject in @/lang/index.js
      const translatedTitle = this.$t('systemRoute.' + title)

      return translatedTitle
    }
    return title
  }else{
    const hasKey = this.$te('route.' + title)
    if (hasKey) {
      // $t :this method from vue-i18n, inject in @/lang/index.js
      const translatedTitle = this.$t('route.' + title)

      return translatedTitle
    }
    return title
  }
  
}
