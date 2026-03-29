import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Droplets,
  HandHeart,
  MapPin,
  Navigation,
  Stethoscope,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNearbyEvents } from "../hooks/useQueries";

const SAMPLE_NEARBY = [
  {
    id: "1",
    type: "Hospital",
    name: "Apollo Hospitals",
    address: "Greams Road, Chennai",
    distance: "1.2 km",
    icon: <Building2 className="w-5 h-5" />,
    services: ["Blood Donation", "Emergency"],
    bloodGroups: ["O+", "A-"],
  },
  {
    id: "2",
    type: "Blood Bank",
    name: "National Blood Bank",
    address: "Egmore, Chennai",
    distance: "2.1 km",
    icon: <Droplets className="w-5 h-5" />,
    services: ["Blood Storage", "Plasma"],
    bloodGroups: ["All groups"],
  },
  {
    id: "3",
    type: "Trust",
    name: "Seva Samiti Trust",
    address: "T. Nagar, Chennai",
    distance: "3.4 km",
    icon: <HandHeart className="w-5 h-5" />,
    services: ["Clothes", "Essentials"],
    bloodGroups: [],
  },
  {
    id: "4",
    type: "Hospital",
    name: "MIOT International",
    address: "Manapakkam, Chennai",
    distance: "5.7 km",
    icon: <Stethoscope className="w-5 h-5" />,
    services: ["Blood Donation", "Surgery"],
    bloodGroups: ["B+", "AB-"],
  },
];

export function NearMeScreen() {
  const [locationGranted, setLocationGranted] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [filter, setFilter] = useState("All");

  const { isLoading } = useNearbyEvents(userLocation);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation(`${pos.coords.latitude},${pos.coords.longitude}`);
          setLocationGranted(true);
        },
        () => {
          setLocationGranted(true); // fallback
          setUserLocation("Chennai");
        },
      );
    } else {
      setLocationGranted(true);
      setUserLocation("Chennai");
    }
  };

  const filters = ["All", "Hospital", "Blood Bank", "Trust"];
  const filtered =
    filter === "All"
      ? SAMPLE_NEARBY
      : SAMPLE_NEARBY.filter((e) => e.type === filter);

  return (
    <div className="px-4 pt-4 pb-28">
      <h1 className="font-display font-bold text-2xl text-foreground mb-1">
        Near Me
      </h1>
      <p className="text-muted-foreground text-sm mb-5">
        Find hospitals, blood banks & charities near you
      </p>

      {/* Map area */}
      <div className="relative h-52 bg-accent/30 rounded-2xl overflow-hidden mb-5 border border-border">
        {/* Grid map bg */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-6 opacity-10">
          {Array.from({ length: 60 }, (_, i) => i).map((i) => (
            <div key={i} className="border border-muted-foreground/40" />
          ))}
        </div>
        {/* Pins */}
        {locationGranted &&
          filtered.map((item, i) => (
            <motion.div
              key={item.id}
              className="absolute flex flex-col items-center"
              style={{ left: `${15 + i * 22}%`, top: `${25 + (i % 3) * 22}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-glow ${
                  item.type === "Hospital"
                    ? "bg-primary"
                    : item.type === "Blood Bank"
                      ? "bg-red-700"
                      : "bg-orange-500"
                }`}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[9px] bg-card px-1 py-0.5 rounded shadow-xs mt-0.5 font-medium whitespace-nowrap max-w-[60px] truncate">
                {item.name}
              </span>
            </motion.div>
          ))}
        {!locationGranted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Navigation className="w-8 h-8 text-primary/40" />
            <p className="text-sm text-muted-foreground">
              Enable location to see nearby places
            </p>
            <Button
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
              onClick={requestLocation}
              data-ocid="nearme.enable_location.button"
            >
              <Navigation className="w-3 h-3 mr-1" /> Enable Location
            </Button>
          </div>
        )}
        {locationGranted && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-card border border-border text-muted-foreground text-[10px] rounded-full">
              <MapPin className="w-2.5 h-2.5 mr-1 text-primary" />
              {userLocation === "Chennai" ? "Chennai, TN" : "Current Location"}
            </Badge>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFilter(f)}
            data-ocid={`nearme.filter.${f.toLowerCase().replace(" ", "_")}.button`}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }, (_, i) => i).map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : filtered.length === 0 ? (
          <div
            className="bg-accent/30 rounded-2xl p-8 text-center"
            data-ocid="nearme.empty_state"
          >
            <MapPin className="w-10 h-10 text-primary/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No {filter} found nearby
            </p>
          </div>
        ) : (
          filtered.map((item, i) => (
            <motion.div
              key={item.id}
              data-ocid={`nearme.item.${i + 1}`}
              className="bg-card rounded-2xl p-4 card-shadow border border-border"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
                    item.type === "Hospital"
                      ? "bg-primary"
                      : item.type === "Blood Bank"
                        ? "bg-red-700"
                        : "bg-orange-500"
                  }`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {item.address}
                      </p>
                    </div>
                    <Badge className="bg-accent text-accent-foreground border-0 text-[10px] rounded-full shrink-0">
                      {item.distance}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-wrap gap-1">
                      {item.services.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-primary/30 text-primary hover:bg-primary/5 text-xs h-7 ml-2 shrink-0"
                      data-ocid={`nearme.directions.button.${i + 1}`}
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${encodeURIComponent(`${item.name} ${item.address}`)}`,
                          "_blank",
                        )
                      }
                    >
                      Directions
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
