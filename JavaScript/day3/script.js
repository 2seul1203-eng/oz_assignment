const API_URL = "https://api4.binance.com/api/v3/ticker/24hr";

const searchInput = document.querySelector("#search-input");
const allTab = document.querySelector("#all-tab");
const favoriteTab = document.querySelector("#favorite-tab");
const coinList = document.querySelector("#coin-list");

let allCoins = [];
let currentTab = "all";

// localStorage에 저장된 관심목록 불러오기 (없으면 빈 배열)
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// 1초마다 API 요청해서 최신 데이터 받아오기
function fetchData() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            // USDT로 끝나는 심볼만 남기기
            allCoins = data.filter(coin => coin.symbol.endsWith("USDT"));
            renderList();
        });
}

setInterval(fetchData, 1000);
fetchData();

function renderList() {
    let coinsToShow = allCoins;

    // 관심목록 탭이면 즐겨찾기한 코인만 남기기
    if (currentTab === "favorite") {
        coinsToShow = coinsToShow.filter(coin => favorites.includes(coin.symbol));
    }

    // 검색어로 필터링
    const keyword = searchInput.value.trim().toUpperCase();
    if (keyword !== "") {
        coinsToShow = coinsToShow.filter(coin => coin.symbol.includes(keyword));
    }

    let html = "";

    coinsToShow.forEach(coin => {
        const isFavorite = favorites.includes(coin.symbol);
        const changePercent = Number(coin.priceChangePercent);
        const changeClass = changePercent >= 0 ? "up" : "down";

        html += `
            <tr>
                <td><button class="favorite-btn" data-symbol="${coin.symbol}">${isFavorite ? "★" : "☆"}</button></td>
                <td>${coin.symbol}</td>
                <td>${coin.lastPrice}</td>
                <td class="${changeClass}">${changePercent}%</td>
            </tr>
        `;
    });

    coinList.innerHTML = html;

    // 즐겨찾기 버튼에 클릭 이벤트 연결
    const favoriteBtns = document.querySelectorAll(".favorite-btn");
    favoriteBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            toggleFavorite(btn.dataset.symbol);
        });
    });
}

function toggleFavorite(symbol) {
    if (favorites.includes(symbol)) {
        favorites = favorites.filter(item => item !== symbol);
    } else {
        favorites.push(symbol);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderList();
}

// 검색창에 입력할 때마다 다시 그리기
searchInput.addEventListener("input", renderList);

// 탭 전환
allTab.addEventListener("click", function () {
    currentTab = "all";
    allTab.classList.add("active");
    favoriteTab.classList.remove("active");
    renderList();
});

favoriteTab.addEventListener("click", function () {
    currentTab = "favorite";
    favoriteTab.classList.add("active");
    allTab.classList.remove("active");
    renderList();
});