"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sword, Shield, Heart } from "lucide-react";

interface PlayerStats {
  name: string;
  kills: number;
  assists: number;
  timeSpentDead: number;
  topHeroDamageTeam: boolean;
  topHeroDamageMatch: boolean;
  topSiegeDamageTeam: boolean;
  topSiegeDamageMatch: boolean;
  topHealingMatch: boolean;
  topXPContributionTeam: boolean;
  topXPContributionMatch: boolean;
  role: string;
  topDamageReceivedTeam: boolean;
  topDamageReceivedMatch: boolean;
}

const initialPlayerStats: PlayerStats = {
  name: "",
  kills: 0,
  assists: 0,
  timeSpentDead: 0,
  topHeroDamageTeam: false,
  topHeroDamageMatch: false,
  topSiegeDamageTeam: false,
  topSiegeDamageMatch: false,
  topHealingMatch: false,
  topXPContributionTeam: false,
  topXPContributionMatch: false,
  role: "",
  topDamageReceivedTeam: false,
  topDamageReceivedMatch: false,
};

function calculateMVP(playerStats: PlayerStats, gameLength: number) {
  let mvpScore = 0;
  const gameLengthInSeconds = gameLength * 60; // Convert minutes to seconds

  mvpScore += playerStats.kills;
  mvpScore += playerStats.assists;
  mvpScore += (playerStats.timeSpentDead / gameLengthInSeconds) * 100 * -0.5;
  
  if (playerStats.topHeroDamageTeam) mvpScore += 1;
  if (playerStats.topHeroDamageMatch) mvpScore += 1;
  if (playerStats.topSiegeDamageTeam) mvpScore += 1;
  if (playerStats.topSiegeDamageMatch) mvpScore += 1;
  if (playerStats.topHealingMatch) mvpScore += 1;
  if (playerStats.topXPContributionTeam) mvpScore += 1;
  if (playerStats.topXPContributionMatch) mvpScore += 1;
  if (playerStats.role === "Warrior" && playerStats.topDamageReceivedTeam) mvpScore += 0.5;
  if (playerStats.role === "Warrior" && playerStats.topDamageReceivedMatch) mvpScore += 1;

  return mvpScore.toFixed(2);
}

export default function Home() {
  const [gameLength, setGameLength] = useState<number>(20);
  const [players, setPlayers] = useState<Array<PlayerStats & { team: string }>>(
    Array(10).fill(null).map((_, index) => ({
      ...initialPlayerStats,
      team: index < 5 ? "red" : "blue"
    }))
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would implement the image processing logic
      // For now, we'll just log that an image was uploaded
      console.log("Image uploaded:", file.name);
    }
  };

  const updatePlayer = (index: number, field: keyof PlayerStats, value: any) => {
    const newPlayers = [...players];
    newPlayers[index] = {
      ...newPlayers[index],
      [field]: value,
    };
    setPlayers(newPlayers);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">MVP Calculator</h1>
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="gameLength">Game Length (minutes)</Label>
            <Input
              id="gameLength"
              type="number"
              value={gameLength}
              onChange={(e) => setGameLength(Number(e.target.value))}
              className="w-24"
            />
            <Label htmlFor="imageUpload">Upload Game Screenshot</Label>
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {["red", "blue"].map((team) => (
            <div key={team} className={`space-y-4 ${team === "red" ? "bg-red-50" : "bg-blue-50"} p-6 rounded-lg`}>
              <h2 className={`text-2xl font-bold ${team === "red" ? "text-red-600" : "text-blue-600"}`}>
                {team.charAt(0).toUpperCase() + team.slice(1)} Team
              </h2>
              <div className="grid gap-6">
                {players
                  .filter((player) => player.team === team)
                  .map((player, teamIndex) => {
                    const globalIndex = team === "red" ? teamIndex : teamIndex + 5;
                    return (
                      <Card key={globalIndex} className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Input
                              placeholder="Player Name"
                              value={player.name}
                              onChange={(e) => updatePlayer(globalIndex, "name", e.target.value)}
                            />
                            <Select
                              value={player.role}
                              onValueChange={(value) => updatePlayer(globalIndex, "role", value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Warrior"><Shield className="inline mr-2" />Warrior</SelectItem>
                                <SelectItem value="Assassin"><Sword className="inline mr-2" />Assassin</SelectItem>
                                <SelectItem value="Support"><Heart className="inline mr-2" />Support</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Kills</Label>
                              <Input
                                type="number"
                                value={player.kills}
                                onChange={(e) => updatePlayer(globalIndex, "kills", Number(e.target.value))}
                              />
                            </div>
                            <div>
                              <Label>Assists</Label>
                              <Input
                                type="number"
                                value={player.assists}
                                onChange={(e) => updatePlayer(globalIndex, "assists", Number(e.target.value))}
                              />
                            </div>
                            <div>
                              <Label>Time Dead (minutes)</Label>
                              <Input
                                type="number"
                                value={player.timeSpentDead}
                                onChange={(e) => updatePlayer(globalIndex, "timeSpentDead", Number(e.target.value))}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label>Top Hero Damage (Team)</Label>
                                <Switch
                                  checked={player.topHeroDamageTeam}
                                  onCheckedChange={(checked) => updatePlayer(globalIndex, "topHeroDamageTeam", checked)}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label>Top Hero Damage (Match)</Label>
                                <Switch
                                  checked={player.topHeroDamageMatch}
                                  onCheckedChange={(checked) => updatePlayer(globalIndex, "topHeroDamageMatch", checked)}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label>Top Siege Damage (Team)</Label>
                                <Switch
                                  checked={player.topSiegeDamageTeam}
                                  onCheckedChange={(checked) => updatePlayer(globalIndex, "topSiegeDamageTeam", checked)}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label>Top Siege Damage (Match)</Label>
                                <Switch
                                  checked={player.topSiegeDamageMatch}
                                  onCheckedChange={(checked) => updatePlayer(globalIndex, "topSiegeDamageMatch", checked)}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label>Top Healing (Match)</Label>
                                <Switch
                                  checked={player.topHealingMatch}
                                  onCheckedChange={(checked) => updatePlayer(globalIndex, "topHealingMatch", checked)}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label>Top XP Contribution (Team)</Label>
                                <Switch
                                  checked={player.topXPContributionTeam}
                                  onCheckedChange={(checked) => updatePlayer(globalIndex, "topXPContributionTeam", checked)}
                                />
                              </div>
                            </div>
                          </div>

                          {player.role === "Warrior" && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center justify-between">
                                <Label>Top Damage Received (Team)</Label>
                                <Switch
                                  checked={player.topDamageReceivedTeam}
                                  onCheckedChange={(checked) => updatePlayer(globalIndex, "topDamageReceivedTeam", checked)}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label>Top Damage Received (Match)</Label>
                                <Switch
                                  checked={player.topDamageReceivedMatch}
                                  onCheckedChange={(checked) => updatePlayer(globalIndex, "topDamageReceivedMatch", checked)}
                                />
                              </div>
                            </div>
                          )}

                          <div className="mt-4 text-xl font-bold">
                            MVP Score: {calculateMVP(player, gameLength)}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}