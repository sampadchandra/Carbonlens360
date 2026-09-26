import httpx

BASE = "http://127.0.0.1:8000"

def test_full_loop():
    # 1. Start Commute
    res = httpx.post(f"{BASE}/api/commute/start", json={
        "user_id": "u1111111-1111-1111-1111-111111111111",
        "travel_mode": "cycling",
        "start_lat": 12.9716,
        "start_lng": 77.5946
    })
    assert res.status_code == 200
    start_data = res.json()
    print("1. Commute Started:", start_data)

    # 2. End Commute
    res2 = httpx.post(f"{BASE}/api/commute/end", json={
        "trip_id": start_data["trip_id"],
        "end_lat": 12.9750,
        "end_lng": 77.6050,
        "photo_base64": "live_camera_proof_hash_123"
    })
    assert res2.status_code == 200
    end_data = res2.json()
    print("2. Commute Ended & Verified:", end_data)

    # 3. Generate Canteen Reward QR
    res3 = httpx.post(f"{BASE}/api/rewards/generate-qr", json={
        "user_id": "u1111111-1111-1111-1111-111111111111",
        "reward_id": "r2"
    })
    assert res3.status_code == 200
    qr_data = res3.json()
    print("3. Generated Signed QR Token:", qr_data.get("token_code"))

    # 4. Canteen Staff POS Scan & Redeem
    res4 = httpx.post(f"{BASE}/api/canteen/scan", json={
        "token_code": qr_data["token_code"],
        "canteen_staff_id": "u5555555-5555-5555-5555-555555555555"
    })
    assert res4.status_code == 200
    redeem_data = res4.json()
    print("4. Canteen Redemption Result:", redeem_data.get("status"), redeem_data.get("receipt_code"))

    # 5. Attempt Double-Redemption (Anti-Fraud Check)
    res5 = httpx.post(f"{BASE}/api/canteen/scan", json={
        "token_code": qr_data["token_code"],
        "canteen_staff_id": "u5555555-5555-5555-5555-555555555555"
    })
    assert res5.status_code == 200
    double_res = res5.json()
    print("5. Double-Redemption Blocked:", double_res.get("status"), double_res.get("message"))
    assert double_res["status"] == "REJECTED"

    print("\nALL CORE PRODUCT LOOP API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_full_loop()
