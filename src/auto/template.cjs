module.exports = (name) => {
  return `<script setup lang='ts'></script>
  
  <template>
  <h1>${name}</h1>
</template>

<script lang='ts'>
  export default {
    name: '${name}'
  }
</script>



<style lang='scss' scoped></style>
`
}
