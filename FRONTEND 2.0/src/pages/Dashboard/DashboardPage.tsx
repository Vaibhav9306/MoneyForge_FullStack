import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import { DashboardLayer } from "../../components/DashboardLayer";
import { IdeaLayer } from "../../components/IdeaLayer";
import { ExecutionLayer } from "../../components/ExecutionLayer";
import { FinanceLayer } from "../../components/FinanceLayer";
import { GrowthLayer } from "../../components/GrowthLayer";
import { WealthLayer } from "../../components/WealthLayer";
import { ProfileLayer } from "../../components/ProfileLayer";
import { BudgetLayer } from "../../components/BudgetLayer";
import { ToolsLayer } from "../../components/ToolsLayer";
import { LandingPageLayer } from "../../components/LandingPageLayer";
import { ActiveContextBanner } from "../../components/ActiveContextBanner";
import { Layer } from "../../types";

export function DashboardPage() {
  const [activeLayer, setActiveLayer] = useState<Layer>("dashboard");

  const renderLayer = () => {
    switch (activeLayer) {
      case "dashboard":
        return <DashboardLayer />;
      case "idea":
        return <IdeaLayer onLayerChange={setActiveLayer} />;
      case "execution":
        return <ExecutionLayer onLayerChange={setActiveLayer} />;
      case "finance":
        return <FinanceLayer />;
      case "growth":
        return <GrowthLayer />;
      case "wealth":
        return <WealthLayer />;
      case "budget":
        return <BudgetLayer />;
      case "tools":
        return <ToolsLayer onLayerChange={setActiveLayer} />;
      case "landing":
        return <LandingPageLayer />;
      case "profile":
        return <ProfileLayer />;
      default:
        return <DashboardLayer />;
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <Sidebar activeLayer={activeLayer} onLayerChange={setActiveLayer} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header onLayerChange={setActiveLayer} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8 lg:p-12">
            <ActiveContextBanner onLayerChange={setActiveLayer} />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLayer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderLayer()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
