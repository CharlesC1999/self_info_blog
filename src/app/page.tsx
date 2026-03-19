import Image from "next/image";
import cakeIcon from "@/assets/cake.png";
import githubIcon from "@/assets/github.png";
import DraggableHead from "@/components/DraggableHead";
import IconPlate from "@/components/IconPlate";
import StickyNote from "@/components/StickyNote";
import Tape from "@/components/Tape";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.hero}>
      <DraggableHead />
      <StickyNote initialX={820} initialY={60} pinLeft={16} pinTop={-16}>
        <h3>Hi, I&apos;m Charles</h3>
        <br />
        Frontend developer exploring interaction, motion, and playful UI details.
        <br />
        This page mixes draggable notes, pinned icons, and scroll-based animation experiments.
      </StickyNote>
      <div className={styles.iconGroupLeft}>
        <div className={styles.iconStack}>
          <Tape className={styles.iconTape} width={66} height={20} rotation={-12} />
          <IconPlate size={82}>
            <Image src={githubIcon} alt="GitHub icon" width={43} height={43} />
          </IconPlate>
        </div>
      </div>
      <div className={styles.iconGroupRight}>
        <div className={styles.iconStack}>
          <Tape className={styles.iconTape} width={62} height={18} rotation={10} />
          <IconPlate size={82}>
            <Image src={cakeIcon} alt="Cake icon" width={43} height={43} />
          </IconPlate>
        </div>
      </div>
    </div>
  );
}
