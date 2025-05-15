<template>
  <el-dialog v-model="open" title="GameRules" width="700" height="500" align-center>
    <div class="demo-collapse">
      <el-collapse>
        <el-collapse-item title="GAMERULES1" name="1">
          <div>
            Consistent with real life: in line with the process and logic of real life, and comply
            with languages and habits that the users are used to;
          </div>
          <div>
            Consistent within interface: all elements should be consistent, such as: design style,
            icons and texts, position of elements, etc.
          </div>
        </el-collapse-item>
        <el-collapse-item title="GAMERULES2" name="2">
          <div>
            Operation feedback: enable the users to clearly perceive their operations by style
            updates and interactive effects;
          </div>
          <div>
            Visual feedback: reflect current state by updating or rearranging elements of the page.
          </div>
        </el-collapse-item>
        <el-collapse-item title="GAMERULES3" name="3">
          <div>Simplify the process: keep operating process simple and intuitive;</div>
          <div>
            Definite and clear: enunciate your intentions clearly so that the users can quickly
            understand and make decisions;
          </div>
          <div>
            Easy to identify: the interface should be straightforward, which helps the users to
            identify and frees them from memorizing and recalling.
          </div>
        </el-collapse-item>
        <el-collapse-item title="GAMERULES4" name="4">
          <div>
            Decision making: giving advices about operations is acceptable, but do not make
            decisions for the users;
          </div>
          <div>
            Controlled consequences: users should be granted the freedom to operate, including
            canceling, aborting or terminating current operation.
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-dialog>
</template>
<!--
<el-button @click="toggleRules">Show Rules</el-button> -->

<script lang="ts" setup>
import { ref, watch } from 'vue'

// const showRules = ref(false)
const open = ref(false)

// const toggleRules = () => {
//   showRules.value = !showRules.value
// }

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
})

watch(
  () => props.isOpen,
  (newValue) => {
    open.value = newValue
  },
  { immediate: true },
)
</script>

<style></style>
