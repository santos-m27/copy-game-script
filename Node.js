function sendDiscord(message)
	local webhookUrl = "https://discord.com/api/webhooks/1362192718218006580/NeJsmRKwktwr6jzvGcW7fsofLIoOGoSvReQfjKkXongWIZabiZIAppiNX5i_7s2m9piL"

	local payload = {
		content = "```\n" .. message .. "\n```"
	}

	local success, response = pcall(function()
		return HttpService:PostAsync(webhookUrl, HttpService:JSONEncode(payload))
	end)

	if success then
		print("Sent successfully")
	else
		warn("Failed to send:", response)
	end
end
