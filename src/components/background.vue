<!-- components/background.vue -->
<template>
  <h1 style="position: absolute;z-index: 20;color: #ffffff;font-size: 70px;">Welcome</h1>
  <div class="solar-system">
    <!-- 动态生成背景星空 -->
    <div
        v-for="(star, index) in stars"
        :key="'star'+index"
        class="star"
        :style="star.style"
    ></div>

    <!-- 太阳 -->
    <div class="sun"></div>

    <!-- 行星轨道和行星 -->
    <div v-for="(planet, index) in planets">
      <div
          v-if="planet.name !== '行星带'"
          :key="index"
          class="orbit"
          :style="{
        width: planet.orbitRadius + 'px',
        height: planet.orbitRadius + 'px',
        animationDuration: planet.speed + 's'
          }"
      >
        <div
            class="planet"
            :style="{
          width: planet.size + 'px',
          height: planet.size + 'px',
          top: -planet.size/2 + 'px',
          backgroundColor: planet.color
        }"
        >
          <!-- 地球的月球轨道 -->
          <div
              v-if="planet.name === '地球'"
              class="moon-orbit"
              :style="{
            animationDuration: moon.speed + 's',
            width: moon.orbitRadius + 'px',
            height: moon.orbitRadius + 'px'
          }"
          >
            <div
                class="moon"
                :style="{
              width: moon.size + 'px',
              height: moon.size + 'px',
              top: -moon.size/2 + 'px',
              backgroundColor: moon.color
            }"
            ></div>
          </div>

        </div>
      </div>
      <div v-else>
        <div
            class="belt"
            :style="{
          width: planet.orbitRadius + 'px',
          height: planet.orbitRadius + 'px',
          boxShadow: Asteroidbelt,
          animationDuration: planet.speed*2 + 's',
        }"></div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';


const planets = ref([
  { name: '水星', color: '#A8A9AD', orbitRadius: 90, size: 4, speed: 2.4 },
  { name: '金星', color: '#FFD700', orbitRadius: 120, size: 8, speed: 6.1 },
  { name: '地球', color: '#3A86FF', orbitRadius: 180, size: 16, speed: 10 },
  { name: '火星', color: '#FF4500', orbitRadius: 240, size: 16, speed: 18.8 },
  { name: '行星带', color: "#FFFFFF", orbitRadius: 280, size: 10, speed: 48},
  { name: '木星', color: '#BC5F04', orbitRadius: 380, size: 40, speed: 118 },
  { name: '土星', color: '#F4D03F', orbitRadius: 480, size: 24, speed: 294 },
  { name: '天王星', color: '#6BDAE5', orbitRadius: 580, size: 20, speed: 840 },
  { name: '海王星', color: '#4169E1', orbitRadius: 680, size: 18, speed: 1648 },
]);

// 月球配置
const moon = {
  color: '#ffffff',
  orbitRadius: 30,  // 相对于地球的轨道半径
  size: 4,
  speed: 2          // 更快的公转速度
};

// 星空配置
const stars = ref([]);
const generateStars = () => {
  const starCount = 200;
  stars.value = Array.from({ length: starCount }, () => ({
    style: {
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      animationDelay: Math.random() * 5 + 's',
      width: Math.random() * 3 + 1 + 'px',
      height: Math.random() * 3 + 1 + 'px',
    }
  }));
};

let AsteroidNum = 1700;
const innerRadius = 100;  // 行星带内径
const outerRadius = 150;  // 行星带外径

const Asteroidbelt = Array.from({length: AsteroidNum}, () => {
  // 极坐标均匀分布算法[4,6](@ref)
  const theta = Math.random() * 2 * Math.PI; // 均匀角度分布
  const r = Math.sqrt((outerRadius**2 - innerRadius**2) * Math.random() + innerRadius**2); // 径向均匀分布

  // 极坐标转笛卡尔坐标
  const x = Math.round(r * Math.cos(theta));
  const y = Math.round(r * Math.sin(theta));

  // 动态透明度增强层次感
  const opacity = Math.min(0.8, Math.random()*0.5 + 0.3);
  return `${x}px ${y}px 0 -139px rgba(255,255,255,${opacity})`;
}).join(',');


onMounted(() =>{
  generateStars();
});


</script>

<style scoped>
.solar-system {
  position: fixed;
  top: 3rem;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: #1a202c;
  overflow: hidden;
}

/* 新增星空样式 */
.star {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: twinkle 3s infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* 太阳放大并增强光晕 */
.sun {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: radial-gradient(
      goldenrod 0%,
      goldenrod 64%,
      transparent 76%,
      transparent 100%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 80px #ff4500;
}

/* 行星轨道 */
.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: rotate linear infinite;
}

/* 行星 */
.planet {
  position: absolute;
  left: 50%;
  border-radius: 50%;
  transform: translateX(-50%);
}

/* 月球轨道 */
.moon-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: rotate linear infinite;
}

.moon {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
/* 行星带 */
.belt {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: rotate linear infinite;
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>