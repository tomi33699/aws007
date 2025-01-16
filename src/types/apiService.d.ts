export async function getBukkData(date?: string): Promise<any> {
  const url = date
    ? `https://eforceapi.hu/bukk_raw_data?date=${date}`
    : "https://eforceapi.hu/bukk_raw_data";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a Bükki adatokat az API-ról.");
  }
  return await response.json();
}


export async function getHalmajData(date?: string): Promise<any> {
  const url = date
    ? `https://eforceapi.hu/halmaj_raw_data?date=${date}`
    : "https://eforceapi.hu/halmaj_raw_data";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a Halmaj adatokat az API-ról.");
  }
  return await response.json();
}



export async function getHupxData(): Promise<any> {
  const response = await fetch("https://eforceapi.hu/hupx_data");
  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a HUPX adatokat az API-ról.");
  }
  return await response.json();
}

export async function getBalancingData(): Promise<any> {
  const response = await fetch("https://eforceapi.hu/balancing_activated_price");
  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a Balancing Prices adatokat az API-ról.");
  }
  return await response.json();
}

export async function getBalancingVolume(): Promise<any> {
  const response = await fetch("https://eforceapi.hu/balancing_activated_volume");
  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a Balancing Volume adatokat az API-ról.");
  }
  return await response.json();
}
