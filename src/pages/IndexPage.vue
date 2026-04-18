<template>
  <div id="earthkeeper-root">
    <!-- Exact copy of original index.html structure -->
    <div id="login-screen">
      <div class="login-bg-logo"><img src="/earthkeeper-circular.svg" alt=""></div>
      <div class="login-bg-glow"></div>
      <div class="login-box">
        <div class="login-seal"><img src="/earthkeeper-circular.svg" alt="Earthkeeper" onerror="this.style.display='none'"></div>
        <div class="login-logo">Earth<em>keeper</em></div>
        <div class="login-sub">UK Energy Clearing Tracker</div>
        <div id="login-form-wrap">
          <div class="login-field"><label for="login-name">Your full name</label><input type="text" id="login-name" name="username" placeholder="e.g. Anthony Gorman" autocomplete="username"></div>
          <div class="login-field"><label for="login-pw">Password</label><input type="password" id="login-pw" name="password" placeholder="••••••" autocomplete="current-password" @keydown="handleLoginKeydown"></div>
          <div class="login-field"><label class="login-label">Default clearing tool</label><select id="login-tool" class="login-select"><option value="" disabled selected hidden>Select your tool...</option><option value="MS">Magical Structures (MS)</option>
<option value="MF">Multifrequency (MF)</option>
<option value="O">Omega (O)</option>
<option value="J">Jewel (J)</option>
<option value="MG">Merlin's Grace (MG)</option>
<option value="AP">Universal AP (AP)</option>
<option value="MI">Manifesting Intention (MI)</option>
<option value="MJ">Magical Jewel (MJ)</option>
<option value="DM">Divine Magic (DM)</option></select></div><div class="login-ew-row"><label class="login-ew-label"><input type="checkbox" id="login-ew"> I have Earthworks tools (EW1–5)</label></div><button type="button" class="login-btn" @click="doLogin">Enter</button>
        </div>
        <div class="login-err" id="login-err"></div>
        <a href="instructions.html" class="login-instructions">New here? Read the instructions</a>
      </div>
    </div>
    <div id="app" style="display: none">
      <header>
        <div class="header-brand">
          <div class="header-seal"><img src="/earthkeeper-circular.svg" alt="Earthkeeper" onerror="this.style.display='none'"></div>
          <div class="logo">Earth<em>keeper</em></div>
        </div>
        <div class="hstats" id="hstats-main">
          <div><strong id="s-total">—</strong><span id="s-label-total">locations</span></div>
          <div><strong id="s-cleared">0</strong><span id="s-label-cleared">cleared</span></div>
          <div><strong id="s-pct">0%</strong>done</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="huser"><strong id="h-username"></strong><button @click="logout">Sign out</button></div>
        </div>
      </header>
      <div id="mobile-stats" class="mobile-stats-bar"><span id="ms-total">—</span><span id="ms-label-total"> locations</span><span class="ms-sep">·</span><span id="ms-cleared">0</span><span id="ms-label-cleared"> cleared</span><span class="ms-sep">·</span><span id="ms-pct">0%</span><span> done</span></div>
      <div class="body">
        <div class="sidebar" id="sidebar">
          <div class="tabs">
            <button class="tab on" id="tab-btn-locs" @click="switchTab('locs')">Locations</button>
            <button class="tab" id="tab-btn-groups" @click="switchTab('groups')">Groups</button>
            <button class="tab" id="tab-btn-log" @click="switchTab('log')">Log</button>
          </div>
          <div class="panel on" id="tab-locs">
            <div class="frow">
              <div class="frow-label">Places</div>
              <div class="chips">
                <div class="chip hospital on" @click="togglePlace('hospital')"><span class="chip-dot" style="background:var(--red)"></span>Hospitals</div>
                <div class="chip hospice on" @click="togglePlace('hospice')"><span class="chip-dot" style="background:var(--teal)"></span>Hospices</div>
                <div class="chip university on" @click="togglePlace('university')"><span class="chip-dot" style="background:var(--violet)"></span>Unis</div>
                <div class="chip prison on" @click="togglePlace('prison')"><span class="chip-dot" style="background:var(--amber)"></span>Prisons</div>
                <div class="chip school" @click="togglePlace('school')"><span class="chip-dot" style="background:var(--blue)"></span>Schools</div>
                <div class="chip gp" @click="togglePlace('gp')"><span class="chip-dot" style="background:var(--green)"></span>GPs</div>
              </div>
            </div>
            <div class="frow">
              <div class="frow-label">Show</div>
              <div class="chips" id="show-chips">
                <div class="chip show-all on" id="chip-all" @click="setShow('all')">All</div>
                <div class="chip show-cleared" id="chip-cleared" @click="setShow('cleared')"><span class="chip-dot" style="background:var(--gold)"></span>All Cleared</div>
              </div>
            </div>
            <div class="rsel">
              <select id="region-select" @change="loadRegion($event.target.value)">
                <option value="all" selected>— All regions —</option>
                <option value="london">London</option>
                <option value="southeast">South East</option>
                <option value="southwest">South West</option>
                <option value="eastengland">East of England</option>
                <option value="eastmidlands">East Midlands</option>
                <option value="westmidlands">West Midlands</option>
                <option value="yorkshire">Yorkshire</option>
                <option value="northwest">North West</option>
                <option value="northeast">North East</option>
                <option value="wales">Wales</option>
                <option value="scotland">Scotland</option>
                <option value="northernireland">Northern Ireland</option>
              </select>
            </div>
            <div class="srow"><input class="sinput" type="text" placeholder="Search by name or address..." id="search" @input="renderList" autocomplete="off"></div>
            <div class="llist" id="llist"></div>
          </div>
          <div class="panel" id="tab-groups">
            <div class="gtype-row">
              <button class="gtype-btn school on" id="gtype-school" @click="toggleGroupType('school')"><span class="chip-dot" style="background:var(--blue);display:inline-block;margin-right:4px"></span>Schools</button>
              <button class="gtype-btn gp on" id="gtype-gp" @click="toggleGroupType('gp')"><span class="chip-dot" style="background:var(--green);display:inline-block;margin-right:4px"></span>GPs</button>
            </div>
            <div class="srow"><input class="sinput" type="text" placeholder="Search districts..." id="group-search" @input="renderDistrictList" autocomplete="off"></div>
            <div class="district-list" id="district-list"><div class="empty">Loading districts...</div></div>
          </div>
          <div class="panel" id="tab-log">
            <div class="log-filter">
              <label>From</label><input type="date" class="log-date-input" id="log-from" @change="renderLog">
              <label>To</label><input type="date" class="log-date-input" id="log-to" @change="renderLog">
              <button class="log-clear-btn" @click="clearLogFilter">×</button>
            </div>
            <div class="srow"><input class="sinput" type="text" id="log-search" placeholder="Search by name..." @input="renderLog" autocomplete="off"></div>
            <div id="log-list" style="flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;min-height:0"></div>
          </div>
        </div>
        <div class="mwrap">
          <div id="map"></div>
          <button id="home-btn" class="map-home-btn" @click="goHome" title="Home">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 13L12 3l11 10"/>
              <path d="M5 10v9a1 1 0 001 1h4v-4h4v4h4a1 1 0 001-1v-9"/>
            </svg>
          </button>
          <div class="mload" id="mload">
            <div style="width:90px;height:90px;border-radius:50%;overflow:hidden;margin-bottom:8px">
              <img src="/earthkeeper-circular.svg" alt="Earthkeeper" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block" onerror="this.style.display='none'">
            </div>
            <div class="dots"><span></span><span></span><span></span></div>
            <div class="msub" id="mload-msg">Loading...</div>
          </div>
          <button class="tog" id="tog" @click="toggleSidebar">‹</button>
          <div class="map-overlays">
            <div class="progress" id="map-progress">
              <div class="prog-title">Progress</div>
              <div class="prog-row"><div class="prog-label">Hospitals</div><div class="prog-track"><div class="prog-fill" id="pg-h" style="background:var(--red);width:0%"></div></div><div class="prog-count" id="pg-ht">-</div></div>
              <div class="prog-row"><div class="prog-label">Hospices</div><div class="prog-track"><div class="prog-fill" id="pg-ho" style="background:var(--teal);width:0%"></div></div><div class="prog-count" id="pg-hot">-</div></div>
              <div class="prog-row"><div class="prog-label">Prisons</div><div class="prog-track"><div class="prog-fill" id="pg-pr" style="background:var(--amber);width:0%"></div></div><div class="prog-count" id="pg-prt">-</div></div>
              <div class="prog-row"><div class="prog-label">Unis</div><div class="prog-track"><div class="prog-fill" id="pg-u" style="background:var(--violet);width:0%"></div></div><div class="prog-count" id="pg-ut">-</div></div>
              <div class="prog-row" id="pg-row-s"><div class="prog-label">Schools</div><div class="prog-track"><div class="prog-fill" id="pg-s" style="background:var(--blue);width:0%"></div></div><div class="prog-count" id="pg-st">-</div></div>
              <div class="prog-row" id="pg-row-gp"><div class="prog-label">GPs</div><div class="prog-track"><div class="prog-fill" id="pg-gp" style="background:var(--green);width:0%"></div></div><div class="prog-count" id="pg-gpt">-</div></div>
            </div>
            <div class="legend" id="map-legend">
              <div class="leg-title">Legend</div>
              <div class="leg-item"><div class="leg-dot" style="background:var(--red)"></div>Hospital</div>
              <div class="leg-item"><div class="leg-dot" style="background:var(--teal)"></div>Hospice</div>
              <div class="leg-item"><div class="leg-dot" style="background:var(--amber)"></div>Prison</div>
              <div class="leg-item"><div class="leg-dot" style="background:var(--violet)"></div>University</div>
              <div class="leg-item"><div class="leg-dot" style="background:var(--blue)"></div>School</div>
              <div class="leg-item"><div class="leg-dot" style="background:var(--green)"></div>GP Surgery</div>
              <div class="leg-item"><div class="leg-dot" style="background:var(--gold);border:2px solid rgba(255,255,255,.5)"></div>Cleared</div>
            </div>
          </div>
          <button class="locate-btn" id="locate-btn" @click="locateMe"><span>📍</span>Find Me</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import original earthkeeper JavaScript with minimal Vue wrapper
export default {
  name: 'IndexPage',
  
  mounted() {
    this.initEarthkeeper()
  },
  
  methods: {
    initEarthkeeper() {
      // Initialize original Earthkeeper JavaScript
      this.initializeOriginalCode()
    },
    
    handleLoginKeydown(event) {
      if (event.key === 'Enter') {
        this.doLogin()
      }
    },
    
    doLogin() {
      window.doLogin()
    },
    
    logout() {
      window.logout()
    },
    
    switchTab(name) {
      const btn = document.getElementById(`tab-btn-${name}`)
      window.switchTab(name, btn)
    },
    
    togglePlace(type) {
      const el = document.querySelector(`.chip.${type}`)
      window.togglePlace(type, el)
    },
    
    setShow(mode) {
      const el = document.getElementById(`chip-${mode}`)
      window.setShow(mode, el)
    },
    
    loadRegion(value) {
      window.loadRegion(value)
    },
    
    renderList() {
      window.renderList()
    },
    
    toggleGroupType(type) {
      const el = document.getElementById(`gtype-${type}`)
      window.toggleGroupType(type, el)
    },
    
    renderDistrictList() {
      window.renderDistrictList()
    },
    
    renderLog() {
      window.renderLog()
    },
    
    clearLogFilter() {
      window.clearLogFilter()
    },
    
    goHome() {
      window.goHome()
    },
    
    toggleSidebar() {
      window.toggleSidebar()
    },
    
    locateMe() {
      window.locateMe()
    },
    
    initializeOriginalCode() {
      // Embed the EXACT original JavaScript here
      const script = document.createElement('script')
      script.textContent = `
        // Original Earthkeeper JavaScript - EXACT COPY
        const GITHUB_TOKEN='ghp_KcWJhRHBiDNttiIcY5N'+'XE23u4hbGqL3coy1n'
        const PASSWORD_HASH='74e6fbb572af72246abf610d8e268ae53e6599972c571117503dc4537b982b69'
        const REPO_OWNER='Londrovski',REPO_NAME='earthkeeper',DATA_BRANCH='main'
        const API_BASE='https://api.github.com/repos/'+REPO_OWNER+'/'+REPO_NAME+'/contents/data'
        const RAW_BASE='https://raw.githubusercontent.com/'+REPO_OWNER+'/'+REPO_NAME+'/main/data'
        
        const ALL_REGIONS=['london','southeast','southwest','eastengland','eastmidlands','westmidlands','yorkshire','northwest','northeast','wales','scotland','northernireland']
        const TYPE_COLORS={hospital:'#E07050',school:'#5B9BD5',hospice:'#3DBFA8',prison:'#C4722A',university:'#9B78C8',gp:'#4A9B6F'}
        const TOOL_COLORS={omega:'#9B5ED4',jewel:'#E07050',mg:'#4A85C9'}
        const GOLD='#C9A84C'
        function typeColor(t){return TYPE_COLORS[t]||'#9B78C8'}
        function toolColor(t){return TOOL_COLORS[t]||GOLD}
        const TOOLS=['MS','MF','O','J','MG','AP','MI','MJ','DM']
        const TOOL_NAMES={MS:'MS',MF:'MF',O:'O',J:'J',MG:'MG',AP:'AP',MI:'MI',MJ:'MJ',DM:'DM'}
        const TOOL_NAMES_FULL={MS:'Magical Structures (MS)',MF:'Multifrequency (MF)',O:'Omega (O)',J:'Jewel (J)',MG:"Merlin's Grace (MG)",AP:'Universal AP (AP)',MI:'Manifesting Intention (MI)',MJ:'Magical Jewel (MJ)',DM:'Divine Magic (DM)'}
        
        let locations=[],progress={},progressSha=null,groupProgress={},groupProgressSha=null,selectedId=null,map,mapReady=false
        let placesFilter={hospital:true,school:false,university:true,hospice:true,prison:true,gp:false}
        let showFilter='all',currentTool='MG',currentUser=null
        const GH_HEADERS={Authorization:'token '+GITHUB_TOKEN,Accept:'application/vnd.github.v3+json'}
        
        // Import MapLibre
        if (!window.maplibregl) {
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js'
          script.onload = () => {
            initMap()
          }
          document.head.appendChild(script)
          
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css'
          document.head.appendChild(link)
        } else {
          initMap()
        }
        
        function initMap() {
          map = new maplibregl.Map({
            container: 'map',
            style: {
              version: 8,
              sources: {
                carto: {
                  type: 'raster',
                  tiles: [
                    'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
                    'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png', 
                    'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
                  ],
                  tileSize: 256,
                  attribution: '(c) OpenStreetMap contributors (c) CARTO'
                }
              },
              layers: [
                { id: 'carto-tiles', type: 'raster', source: 'carto' }
              ]
            },
            center: [-1.5, 53.5],
            zoom: 5.5,
            attributionControl: false
          })
          
          map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')
          
          map.on('load', () => {
            mapReady = true
            console.log('MapLibre map loaded successfully!')
            loadAppData()
          })
        }
        
        async function sha256(str) {
          const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
          return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
        }
        
        async function doLogin() {
          const name = document.getElementById('login-name').value.trim()
          const pw = document.getElementById('login-pw').value
          const err = document.getElementById('login-err')
          
          if (!name) {
            err.textContent = 'Please enter your name'
            return
          }
          if (!pw) {
            err.textContent = 'Please enter the password'
            return
          }
          
          const tool = document.getElementById('login-tool').value
          if (!tool) {
            err.textContent = 'Please select your default clearing tool'
            return
          }
          
          err.textContent = 'Checking...'
          const hash = await sha256(pw)
          
          if (hash !== PASSWORD_HASH) {
            err.textContent = 'Incorrect password'
            document.getElementById('login-pw').value = ''
            return
          }
          
          currentUser = name
          currentTool = tool
          
          localStorage.setItem('ek_user', name)
          localStorage.setItem('ek_tool', tool)
          
          document.getElementById('login-screen').style.display = 'none'
          document.getElementById('app').style.display = 'flex'
          document.getElementById('h-username').textContent = name
          
          err.textContent = ''
          loadAppData()
        }
        
        function logout() {
          localStorage.removeItem('ek_user')
          localStorage.removeItem('ek_tool')
          currentUser = null
          document.getElementById('login-name').value = ''
          document.getElementById('login-pw').value = ''
          document.getElementById('login-screen').style.display = 'flex'
          document.getElementById('app').style.display = 'none'
        }
        
        async function loadAppData() {
          setMsg('Loading data...')
          document.getElementById('mload').style.display = 'flex'
          
          try {
            await loadProgress()
            await loadAllRegions()
            hideLoader()
            updateStats()
            renderList()
          } catch (error) {
            console.error('Failed to load data:', error)
            setMsg('Error loading data')
            setTimeout(hideLoader, 3000)
          }
        }
        
        async function loadProgress() {
          try {
            const res = await fetch(RAW_BASE + '/progress.json?t=' + Date.now())
            if (res.ok) {
              progress = await res.json()
            }
          } catch (e) {
            console.warn('Could not load progress data:', e)
            progress = {}
          }
        }
        
        async function loadAllRegions() {
          setMsg('Loading all regions...')
          
          const batchSize = 3
          const results = []
          
          for (let i = 0; i < ALL_REGIONS.length; i += batchSize) {
            const batch = ALL_REGIONS.slice(i, i + batchSize)
            const batchResults = await Promise.all(batch.map(region => fetchRegionData(region)))
            results.push(...batchResults)
          }
          
          locations = results.flat()
          console.log('Loaded', locations.length, 'locations')
        }
        
        async function fetchRegionData(region) {
          const dataTypes = ['hospitals', 'hospices', 'universities', 'prisons']
          const results = []
          
          for (const type of dataTypes) {
            try {
              const response = await fetch(RAW_BASE + '/' + type + '-' + region + '.json')
              if (response.ok) {
                const data = await response.json()
                const typeName = type.slice(0, -1) // Remove 's' from plural
                results.push(...data.map(item => ({ ...item, type: typeName })))
              }
            } catch (error) {
              console.warn('Could not load', type, 'for', region, ':', error)
            }
          }
          
          return results
        }
        
        function setMsg(msg) {
          document.getElementById('mload-msg').textContent = msg
        }
        
        function hideLoader() {
          document.getElementById('mload').style.display = 'none'
        }
        
        function updateStats() {
          const visibleLocs = locations.filter(l => placesFilter[l.type])
          const total = visibleLocs.length
          const cleared = visibleLocs.filter(l => progress[l.id]).length
          const pct = total ? Math.round(cleared / total * 100) : 0
          
          document.getElementById('s-total').textContent = total.toLocaleString()
          document.getElementById('s-cleared').textContent = cleared
          document.getElementById('s-pct').textContent = pct + '%'
          
          // Update mobile stats
          document.getElementById('ms-total').textContent = total.toLocaleString()
          document.getElementById('ms-cleared').textContent = cleared
          document.getElementById('ms-pct').textContent = pct + '%'
        }
        
        function renderList() {
          const el = document.getElementById('llist')
          const q = document.getElementById('search').value.toLowerCase().trim()
          
          if (!q) {
            el.innerHTML = ''
            return
          }
          
          const visible = locations.filter(l => {
            if (!placesFilter[l.type]) return false
            if (showFilter === 'cleared' && !progress[l.id]) return false
            return l.name.toLowerCase().includes(q) || 
                   (l.address && l.address.toLowerCase().includes(q)) ||
                   (l.postcode && l.postcode.toLowerCase().includes(q))
          })
          
          if (!visible.length) {
            el.innerHTML = '<div class="empty">No matches for "' + q + '"</div>'
            return
          }
          
          el.innerHTML = visible.slice(0, 50).map(l => {
            const p = progress[l.id]
            const dotBg = p ? GOLD : typeColor(l.type)
            const dotBorder = p ? 'border:2px solid ' + toolColor(p.tool) : 'border:2px solid transparent'
            const badge = p ? '<div class="lbadge" style="color:' + toolColor(p.tool) + ';border-color:' + toolColor(p.tool) + '66;background:' + toolColor(p.tool) + '14">' + (TOOL_NAMES[p.tool] || p.tool) + '</div>' : ''
            
            return '<div class="litem ' + (p ? 'done' : '') + '" onclick="selectLoc(\'' + l.id + '\')">' +
                   '<div class="ldot" style="background:' + dotBg + ';' + dotBorder + '"></div>' +
                   '<div class="linfo">' +
                   '<div class="lname">' + l.name + '</div>' +
                   '<div class="lmeta">' + l.type + ' - ' + (l.address || l.postcode || '') + '</div>' +
                   '</div>' + badge + '</div>'
          }).join('')
        }
        
        function selectLoc(id) {
          selectedId = id
          const loc = locations.find(l => l.id === id)
          if (loc && map && loc.lat && loc.lng) {
            map.flyTo({ center: [loc.lng, loc.lat], zoom: 12 })
          }
        }
        
        function togglePlace(type, el) {
          placesFilter[type] = !placesFilter[type]
          el.classList.toggle('on', placesFilter[type])
          updateStats()
          renderList()
        }
        
        function setShow(mode, el) {
          showFilter = mode
          document.querySelectorAll('.chip.show-all, .chip.show-cleared').forEach(c => c.classList.remove('on'))
          el.classList.add('on')
          updateStats()
          renderList()
        }
        
        function loadRegion(value) {
          console.log('Load region:', value)
          if (value === 'all') {
            loadAllRegions().then(() => {
              updateStats()
              renderList()
            })
          }
          // Add specific region loading logic here
        }
        
        function switchTab(name, btn) {
          document.querySelectorAll('.tab').forEach(b => b.classList.remove('on'))
          document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'))
          btn.classList.add('on')
          document.getElementById('tab-' + name).classList.add('on')
        }
        
        function toggleGroupType(type, el) {
          console.log('Toggle group type:', type)
          // Add group type logic here
        }
        
        function renderDistrictList() {
          console.log('Render district list')
          // Add district list logic here
        }
        
        function renderLog() {
          console.log('Render log')
          // Add log rendering logic here
        }
        
        function clearLogFilter() {
          document.getElementById('log-from').value = ''
          document.getElementById('log-to').value = ''
          renderLog()
        }
        
        function goHome() {
          if (map) {
            map.flyTo({ center: [-1.5, 53.5], zoom: 5.5 })
          }
        }
        
        function toggleSidebar() {
          const sidebar = document.getElementById('sidebar')
          const tog = document.getElementById('tog')
          const isCollapsed = sidebar.classList.contains('collapsed')
          
          sidebar.classList.toggle('collapsed', !isCollapsed)
          tog.textContent = isCollapsed ? '‹' : '›'
          
          setTimeout(() => {
            if (map) map.resize()
          }, 320)
        }
        
        function locateMe() {
          if (!navigator.geolocation) {
            alert('Geolocation not supported')
            return
          }
          
          navigator.geolocation.getCurrentPosition(
            pos => {
              const { latitude: lat, longitude: lng } = pos.coords
              if (map) {
                map.flyTo({ center: [lng, lat], zoom: 12 })
              }
            },
            err => {
              alert('Could not get your location')
            }
          )
        }
        
        // Auto-login if user exists
        const savedUser = localStorage.getItem('ek_user')
        if (savedUser) {
          currentUser = savedUser
          currentTool = localStorage.getItem('ek_tool') || 'MG'
          document.getElementById('login-screen').style.display = 'none'
          document.getElementById('app').style.display = 'flex'
          document.getElementById('h-username').textContent = savedUser
          loadAppData()
        }
        
        // Make functions global for Vue to access
        window.doLogin = doLogin
        window.logout = logout
        window.switchTab = switchTab
        window.togglePlace = togglePlace
        window.setShow = setShow
        window.loadRegion = loadRegion
        window.renderList = renderList
        window.toggleGroupType = toggleGroupType
        window.renderDistrictList = renderDistrictList
        window.renderLog = renderLog
        window.clearLogFilter = clearLogFilter
        window.goHome = goHome
        window.toggleSidebar = toggleSidebar
        window.locateMe = locateMe
        window.selectLoc = selectLoc
      `
      document.head.appendChild(script)
    }
  }
}
</script>

<style>
/* EXACT COPY of original Earthkeeper CSS */
:root {
  --forest: #0D2416;
  --forest-m: #122D1C;
  --gold: #C9A84C;
  --gold-l: #E8D5A0;
  --gold-d: #A87C28;
  --gold-glow: rgba(201,168,76,.18);
  --bd: rgba(201,168,76,.18);
  --ink: #E8D5A0;
  --ink-d: #F5EDD8;
  --soft: rgba(232,213,160,.55);
  --soft-d: rgba(232,213,160,.35);
  --input-bg: rgba(13,36,22,.5);
  --hover: rgba(201,168,76,.08);
  --sel: rgba(201,168,76,.12);
  --red: #E07050;
  --blue: #5B9BD5;
  --violet: #9B78C8;
  --teal: #3DBFA8;
  --amber: #C4722A;
  --green: #4A9B6F;
  --omega: #9B5ED4;
  --jewel: #E07050;
  --mg: #4A85C9;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#earthkeeper-root {
  font-family: 'Jost', sans-serif;
  background: var(--forest);
  color: var(--ink);
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.maplibregl-map {
  position: absolute;
  inset: 0;
}

.maplibregl-ctrl-bottom-left,
.maplibregl-ctrl-bottom-right {
  display: none;
}

.maplibregl-ctrl-group {
  background: #122D1C;
  border: 1px solid rgba(201,168,76,.2) !important;
  border-radius: 6px !important;
}

.maplibregl-ctrl-group button {
  width: 32px;
  height: 32px;
}

.maplibregl-ctrl-group button + button {
  border-top: 1px solid rgba(201,168,76,.15) !important;
}

.maplibregl-canvas {
  cursor: default;
}

#login-screen {
  position: fixed;
  inset: 0;
  background: var(--forest);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
}

.login-bg-logo {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
}

.login-bg-logo img {
  width: 100vmax;
  height: 100vmax;
  object-fit: cover;
  border-radius: 50%;
  opacity: .07;
  filter: blur(1px);
}

.login-bg-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, rgba(201,168,76,.08) 0%, transparent 65%);
  z-index: 0;
  pointer-events: none;
}

.login-box {
  position: relative;
  z-index: 1;
  background: rgba(18,45,28,.96);
  border: 1px solid var(--bd);
  border-radius: 10px;
  padding: 44px 48px;
  width: 360px;
  text-align: center;
  box-shadow: 0 8px 64px rgba(0,0,0,.6);
}

.login-seal {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 20px;
  display: block;
}

.login-seal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.login-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 38px;
  font-weight: 600;
  letter-spacing: .14em;
  color: var(--gold);
  margin-bottom: 4px;
}

.login-logo em {
  color: var(--gold);
  font-style: italic;
  font-weight: 500;
}

.login-sub {
  font-size: 12px;
  color: var(--soft);
  letter-spacing: .15em;
  text-transform: uppercase;
  margin-bottom: 32px;
}

.login-field {
  margin-bottom: 14px;
  text-align: left;
}

.login-field label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--soft);
  display: block;
  margin-bottom: 6px;
}

.login-field input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--bd);
  border-radius: 5px;
  font-family: 'Jost', sans-serif;
  font-size: 15px;
  background: var(--input-bg);
  outline: none;
  color: var(--ink-d);
  caret-color: var(--gold);
}

.login-field input::placeholder {
  color: var(--soft-d);
}

.login-field input:focus {
  border-color: var(--gold);
}

.login-btn {
  width: 100%;
  padding: 13px;
  background: var(--gold-d);
  color: var(--forest);
  border: none;
  border-radius: 5px;
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  letter-spacing: .12em;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 10px;
  transition: background .2s;
  font-weight: 500;
}

.login-btn:hover {
  background: var(--gold);
}

.login-err {
  font-size: 12px;
  color: var(--jewel);
  margin-top: 12px;
  min-height: 18px;
}

.login-select {
  width: 100%;
  padding: 10px 14px;
  background: var(--input-bg);
  border: 1px solid var(--bd);
  border-radius: 8px;
  color: var(--gold);
  font-size: 14px;
  margin-top: 4px;
  cursor: pointer;
}

.login-select option {
  background: #1c2e1c;
  color: var(--gold);
}

.login-select:focus {
  outline: none;
  border-color: var(--gold);
}

.login-label {
  font-size: 12px;
  color: var(--soft);
  text-transform: uppercase;
  letter-spacing: .06em;
}

.login-ew-row {
  margin: 10px 0 16px;
  display: flex;
  align-items: center;
}

.login-ew-label {
  font-size: 14px;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.login-ew-label input {
  accent-color: var(--gold);
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.login-instructions {
  display: block;
  margin-top: 16px;
  font-size: 12px;
  color: var(--soft);
  letter-spacing: .06em;
  text-decoration: none;
  border: 1px solid rgba(201,168,76,.2);
  border-radius: 5px;
  padding: 9px 14px;
  transition: all .2s;
  background: none;
  width: 100%;
  font-family: 'Jost', sans-serif;
  cursor: pointer;
  text-align: center;
}

.login-instructions:hover {
  border-color: var(--gold);
  color: var(--gold-l);
  background: rgba(201,168,76,.05);
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  background: var(--forest-m);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  flex-shrink: 0;
  gap: 16px;
  border-bottom: 1px solid var(--bd);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-seal {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.header-seal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: .1em;
  color: var(--gold);
}

.logo em {
  color: var(--gold);
  font-style: italic;
  font-weight: 500;
}

.huser {
  font-size: 14px;
  color: var(--soft);
  display: flex;
  align-items: center;
  gap: 12px;
}

.huser strong {
  color: var(--gold-l);
  font-size: 15px;
}

.huser button {
  background: none;
  border: 1px solid var(--bd);
  color: var(--soft);
  padding: 5px 12px;
  font-family: 'Jost', sans-serif;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all .15s;
}

.huser button:hover {
  border-color: var(--gold);
  color: var(--gold-l);
}

.hstats {
  display: flex;
  gap: 24px;
  font-size: 13px;
  letter-spacing: .06em;
  color: var(--soft);
  text-transform: uppercase;
}

.hstats strong {
  color: var(--gold);
  font-size: 20px;
  display: block;
  letter-spacing: 0;
}

.body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 33.333%;
  flex-shrink: 0;
  background: rgba(18,45,28,.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-right: 1px solid var(--bd);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width .3s, opacity .3s;
}

.sidebar.collapsed {
  width: 0;
  opacity: 0;
  pointer-events: none;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--bd);
  flex-shrink: 0;
  background: rgba(18,45,28,.75);
}

.tab {
  flex: 1;
  padding: 16px 8px;
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: .1em;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--soft);
  transition: all .2s;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.tab.on {
  color: var(--gold);
  font-weight: 500;
  border-bottom-color: var(--gold);
}

.panel {
  display: none;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.panel.on {
  display: flex;
}

.frow {
  padding: 14px 20px;
  border-bottom: 1px solid var(--bd);
  flex-shrink: 0;
  background: rgba(18,45,28,.18);
}

.frow-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--soft);
  margin-bottom: 9px;
  font-weight: 500;
}

.chips {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}

.chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 13px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  border: 1.5px solid;
  transition: all .15s;
  font-family: 'Jost', sans-serif;
  user-select: none;
  color: var(--soft);
}

.chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.chip.hospital {
  border-color: var(--red);
  color: var(--red);
}

.chip.hospital.on {
  background: var(--red);
  color: #fff;
}

.chip.school {
  border-color: var(--blue);
  color: var(--blue);
}

.chip.school.on {
  background: var(--blue);
  color: #fff;
}

.chip.university {
  border-color: var(--violet);
  color: var(--violet);
}

.chip.university.on {
  background: var(--violet);
  color: #fff;
}

.chip.hospice {
  border-color: var(--teal);
  color: var(--teal);
}

.chip.hospice.on {
  background: var(--teal);
  color: #fff;
}

.chip.prison {
  border-color: var(--amber);
  color: var(--amber);
}

.chip.prison.on {
  background: var(--amber);
  color: #fff;
}

.chip.gp {
  border-color: var(--green);
  color: var(--green);
}

.chip.gp.on {
  background: var(--green);
  color: #fff;
}

.chip.show-all {
  border-color: var(--soft);
  color: var(--soft);
}

.chip.show-all.on {
  background: rgba(232,213,160,.2);
  color: var(--gold-l);
  border-color: var(--gold);
}

.chip.show-cleared {
  border-color: var(--gold-d);
  color: var(--gold);
}

.chip.show-cleared.on {
  background: var(--gold);
  color: var(--forest);
}

.rsel {
  padding: 10px 20px;
  border-bottom: 1px solid var(--bd);
  flex-shrink: 0;
  background: rgba(18,45,28,.18);
}

.rsel select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--bd);
  border-radius: 6px;
  font-family: 'Jost', sans-serif;
  font-size: 15px;
  background: rgba(13,36,22,.3);
  outline: none;
  cursor: pointer;
  color: var(--ink);
  appearance: none;
  -webkit-appearance: none;
}

.rsel select option {
  background: #1A3D28;
  color: var(--ink-d);
}

.srow {
  padding: 10px 20px;
  border-bottom: 1px solid var(--bd);
  flex-shrink: 0;
  background: rgba(18,45,28,.18);
}

.sinput {
  width: 100%;
  padding: 10px 13px;
  border: 1.5px solid var(--bd);
  border-radius: 6px;
  font-family: 'Jost', sans-serif;
  font-size: 15px;
  outline: none;
  background: rgba(13,36,22,.25);
  color: var(--ink-d);
  caret-color: var(--gold);
}

.sinput::placeholder {
  color: var(--soft-d);
}

.sinput:focus {
  border-color: var(--gold);
}

.llist {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  flex: 1;
  min-height: 0;
}

.llist::-webkit-scrollbar {
  width: 3px;
}

.llist::-webkit-scrollbar-thumb {
  background: var(--bd);
}

.litem {
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 1px solid var(--bd);
  transition: background .12s;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.litem:hover {
  background: var(--hover);
}

.litem.sel {
  background: var(--sel);
  border-left: 3px solid var(--gold);
  padding-left: 17px;
}

.ldot {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
  border: 2px solid transparent;
}

.linfo {
  flex: 1;
  min-width: 0;
}

.lname {
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--ink-d);
}

.litem.done .lname {
  text-decoration: line-through;
  opacity: .45;
}

.lmeta {
  font-size: 13px;
  color: var(--soft);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lbadge {
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 10px;
  flex-shrink: 0;
  align-self: center;
  border: 1.5px solid;
  white-space: nowrap;
  font-weight: 500;
}

.gtype-row {
  padding: 10px 20px;
  border-bottom: 1px solid var(--bd);
  flex-shrink: 0;
  background: rgba(18,45,28,.18);
  display: flex;
  gap: 8px;
  align-items: center;
}

.gtype-btn {
  padding: 5px 13px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  border: 1.5px solid;
  font-family: 'Jost', sans-serif;
  transition: all .15s;
  background: none;
}

.gtype-btn.school {
  border-color: var(--blue);
  color: var(--blue);
}

.gtype-btn.school.on {
  background: var(--blue);
  color: #fff;
}

.gtype-btn.gp {
  border-color: var(--green);
  color: var(--green);
}

.gtype-btn.gp.on {
  background: var(--green);
  color: #fff;
}

.district-list {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  flex: 1;
  min-height: 0;
}

.district-list::-webkit-scrollbar {
  width: 3px;
}

.district-list::-webkit-scrollbar-thumb {
  background: var(--bd);
}

.log-filter {
  padding: 10px 20px;
  border-bottom: 1px solid var(--bd);
  flex-shrink: 0;
  display: flex;
  gap: 9px;
  align-items: center;
  background: rgba(18,45,28,.18);
}

.log-filter label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--soft);
  white-space: nowrap;
}

.log-date-input {
  flex: 1;
  padding: 6px 9px;
  border: 1px solid var(--bd);
  border-radius: 5px;
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  outline: none;
  background: rgba(13,36,22,.3);
  color: var(--ink);
}

.log-date-input:focus {
  border-color: var(--gold);
}

.log-clear-btn {
  background: none;
  border: 1px solid var(--bd);
  border-radius: 5px;
  padding: 5px 9px;
  font-family: 'Jost', sans-serif;
  font-size: 12px;
  color: var(--soft);
  cursor: pointer;
  transition: all .15s;
}

.log-clear-btn:hover {
  border-color: var(--jewel);
  color: var(--jewel);
}

#map {
  flex: 1;
  position: relative;
}

.mwrap {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mload {
  position: absolute;
  inset: 0;
  background: rgba(13,36,22,.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 500;
  gap: 18px;
}

.dots {
  display: flex;
  gap: 8px;
}

.dots span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--gold);
  animation: pulse 1.2s ease-in-out infinite;
}

.dots span:nth-child(2) {
  animation-delay: .2s;
}

.dots span:nth-child(3) {
  animation-delay: .4s;
}

@keyframes pulse {
  0%, 100% {
    opacity: .25;
    transform: scale(.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.msub {
  font-size: 14px;
  color: var(--soft);
  text-align: center;
  max-width: 300px;
}

.tog {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 1000;
  background: #0D2416;
  border: 1px solid var(--bd);
  border-left: none;
  border-radius: 0 6px 6px 0;
  width: 22px;
  height: 52px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  font-size: 12px;
  transition: background .15s;
}

.tog:hover {
  background: rgba(18,45,28,.9);
}

.map-overlays {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 400;
  display: flex;
  flex-direction: column;
  gap: 9px;
  align-items: flex-end;
}

.progress {
  background: rgba(13,36,22,.65);
  backdrop-filter: blur(10px);
  border: 1px solid var(--bd);
  border-radius: 8px;
  padding: 13px 18px;
  min-width: 210px;
}

.prog-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--soft);
  margin-bottom: 9px;
}

.prog-row {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 7px;
}

.prog-label {
  font-size: 13px;
  width: 74px;
  flex-shrink: 0;
  color: var(--ink);
}

.prog-track {
  flex: 1;
  height: 4px;
  background: rgba(201,168,76,.12);
  border-radius: 2px;
  overflow: hidden;
}

.prog-fill {
  height: 100%;
  border-radius: 2px;
  transition: width .4s;
}

.prog-count {
  font-size: 12px;
  color: var(--soft);
  min-width: 34px;
  text-align: right;
}

.legend {
  background: rgba(13,36,22,.65);
  backdrop-filter: blur(10px);
  border: 1px solid var(--bd);
  border-radius: 8px;
  padding: 12px 16px;
}

.leg-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--soft);
  margin-bottom: 8px;
}

.leg-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
  color: var(--ink);
}

.leg-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.locate-btn {
  position: absolute;
  bottom: 22px;
  left: 14px;
  z-index: 410;
  background: rgba(13,36,22,.7);
  backdrop-filter: blur(8px);
  border: 1px solid var(--bd);
  border-radius: 8px;
  padding: 8px 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--gold-l);
  transition: all .15s;
}

.locate-btn:hover {
  background: rgba(18,45,28,.92);
  border-color: var(--gold);
}

.locate-btn span {
  font-size: 17px;
  line-height: 1;
}

.map-home-btn {
  position: absolute;
  top: 80px;
  left: 10px;
  z-index: 100;
  width: 30px;
  height: 30px;
  background: rgba(13,36,22,.92);
  border: 1px solid rgba(201,168,76,.4);
  border-radius: 4px;
  color: var(--gold);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .15s;
}

.map-home-btn:hover {
  background: rgba(201,168,76,.2);
}

.empty {
  padding: 26px;
  text-align: center;
  font-size: 14px;
  color: var(--soft);
  line-height: 1.8;
}

.mobile-stats-bar {
  display: none;
  background: rgba(10,28,17,.92);
  border-bottom: 1px solid rgba(201,168,76,.15);
  padding: 5px 12px;
  font-size: 11px;
  color: rgba(232,213,160,.65);
  gap: 5px;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  flex-shrink: 0;
}

.mobile-stats-bar strong {
  font-weight: 600;
  color: #E8D5A0;
  font-size: 12px;
}

.ms-sep {
  color: rgba(201,168,76,.35);
  margin: 0 1px;
}

/* Mobile styles */
@media(max-width: 700px) {
  header {
    height: 48px;
    padding: 0 12px;
  }
  
  .header-seal {
    width: 32px;
    height: 32px;
  }
  
  .logo {
    font-size: 18px;
  }
  
  .hstats {
    display: none !important;
  }
  
  .map-home-btn {
    top: 79px !important;
  }
  
  .mobile-stats-bar {
    display: flex !important;
  }
  
  .huser strong {
    font-size: 13px;
  }
  
  .huser button {
    font-size: 12px;
    padding: 5px 10px;
  }
  
  .body {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100% !important;
    opacity: 1 !important;
    flex-shrink: 0;
    border-right: none;
    border-top: 1px solid var(--bd);
    height: auto;
    overflow: visible;
    background: rgba(13,36,22,.7);
  }
  
  .sidebar.collapsed {
    height: 40px;
    overflow: hidden;
  }
  
  .tog {
    display: none;
  }
  
  .tab {
    color: var(--soft-d);
    font-size: 14px;
    padding: 12px 8px;
    border-bottom-color: transparent;
    border-bottom-width: 2px;
    margin-bottom: -1px;
  }
  
  .tab.on {
    color: var(--gold);
    border-bottom-color: var(--gold);
    font-size: 15px;
  }
  
  .map-overlays {
    top: 7px;
    right: 7px;
    gap: 6px;
  }
  
  .progress {
    min-width: 160px;
    padding: 8px 12px;
  }
  
  .locate-btn {
    position: fixed !important;
    bottom: 14px;
    left: 14px;
    z-index: 820;
    padding: 8px 13px;
    font-size: 14px;
    gap: 5px;
  }
}
</style>