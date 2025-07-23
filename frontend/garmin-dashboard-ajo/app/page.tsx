import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

export default function DashboardLayout() {
  return (
    <TooltipProvider>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Garmin Dashboard</h1>
          <Avatar>
            <img src="/avatar.png" alt="User Avatar" />
          </Avatar>
        </div>

        <Tabs defaultValue="summary">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="coach">Coach</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold">Steps Today</h3>
                  <Progress value={72} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold">VO₂ Max</h3>
                  <div className="text-xl font-bold">48</div>
                  <Badge className="mt-2">Improving</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold">Resting HR</h3>
                  <div className="text-xl font-bold">58 bpm</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Sheet>
          <SheetTrigger asChild>
            <Button>Open Journal</Button>
          </SheetTrigger>
          <SheetContent>
            <h2 className="text-lg font-semibold mb-2">Daily Journal</h2>
            <Label htmlFor="entry">What did you notice today?</Label>
            <Textarea id="entry" className="mt-2" />
            <Button className="mt-4">Save Entry</Button>
          </SheetContent>
        </Sheet>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Goals</Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-lg font-semibold">Edit Weekly Step Goal</h2>
            <Label htmlFor="goal">Steps</Label>
            <Input id="goal" placeholder="e.g. 70000" />
            <Button className="mt-4">Save</Button>
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-2">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <Switch id="dark-mode" />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">What is VO₂ Max?</Button>
          </TooltipTrigger>
          <TooltipContent>
            A measure of your aerobic fitness level. Higher is better.
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

