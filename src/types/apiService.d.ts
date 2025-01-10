export async function getBukkData(): Promise<any> {
  const response = await fetch("http://18.185.80.68:8000/bukk_raw_data");
  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a Bükki adatokat az API-ról.");
  }
  return await response.json();
}

export async function getHalmajData(): Promise<any> {
  const response = await fetch("http://18.185.80.68:8000/halmaj_raw_data");
  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a Halmaj adatokat az API-ról.");
  }
  return await response.json();
}

export async function getHupxData(): Promise<any> {
  const response = await fetch("http://18.185.80.68:8000/hupx_data");
  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a HUPX adatokat az API-ról.");
  }
  return await response.json();
}

export async function getBalancingData(): Promise<any> {
  const response = await fetch("http://18.185.80.68:8000/balancing_activated_price");
  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a Balancing Prices adatokat az API-ról.");
  }
  return await response.json();
}

export async function getBalancingVolume(): Promise<any> {
  const response = await fetch("http://18.185.80.68:8000/balancing_activated_volume");
  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a Balancing Volume adatokat az API-ról.");
  }
  return await response.json();
}