import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Open file
        filepath = os.path.abspath('clock.html')
        await page.goto(f'file://{filepath}')

        # Inject XSS payload into localStorage
        payload = "<img src=x onerror=window.xss_triggered=true>"

        await page.evaluate(f'''() => {{
            localStorage.setItem('worldclocktoolbox:labels', JSON.stringify({{"Europe/Berlin": "{payload}"}}));
        }}''')

        # Reload to apply localStorage
        await page.reload()

        # Wait for rendering
        await page.wait_for_selector('.city-name')

        # Check if XSS was triggered
        xss_triggered = await page.evaluate("() => window.xss_triggered === true")
        print(f"XSS Triggered: {xss_triggered}")

        # Check if payload is rendered as text
        element = await page.query_selector('.city-name')
        text_content = await element.text_content()
        print(f"Text Content: {text_content}")

        if not xss_triggered and text_content == payload:
            print("VERIFICATION SUCCESSFUL")
        else:
            print("VERIFICATION FAILED")

        await browser.close()

asyncio.run(main())
