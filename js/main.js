class StartScreen extends Phaser.Scene {
    constructor() {
        super({key: 'StartScreen'});
    }

    preload() {
        this.load.image('st-header', 'assets/header.png');
        this.load.image('st-p1', 'assets/player_front1.png');
        this.load.image('st-p2', 'assets/player_front2.png');
        this.load.image('st-p3', 'assets/player_front3.png');
        this.load.image('st-ins', 'assets/start_instr.png');
        this.load.image('st-s1', 'assets/student_front1.png');
        this.load.image('st-s2', 'assets/student_front2.png');
        this.load.image('cat', 'assets/cat.png');
    }

    create() {
        this.add.image(270, 152, 'st-header')
            .setDisplaySize(c_header_width, c_header_height)
            .setOrigin(0,0);
        this.add.image(350, 380, 'st-ins')
            .setDisplaySize(c_instr_width, c_instr_height)
            .setOrigin(0,0);
        this.add.image(150, 450, 'st-s1')
            .setOrigin(0,0);
        this.add.image(360, 450, 'st-p1')
            .setOrigin(0,0);
        this.add.image(520, 450, 'st-p2')
            .setOrigin(0,0);
        this.add.image(680, 450, 'st-p3')
            .setOrigin(0,0);
        this.add.image(840, 450, 'st-s2')
            .setOrigin(0,0);
        this.add.image(850, 370, 'cat')
            .setDisplaySize(c_cat_width*2, c_cat_height*2)
            .setOrigin(0,0);
        
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.QKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    }

    update() {
        if (this.spaceKey.isDown) {
            game.scene.start('GameBody');
            game.scene.sleep('StartScreen');
        }
        else if (this.QKey.isDown) {
            if (confirm('Leave the game?')) {
                window.opener = null;
                window.close();
            }
        }
    }
};

class GameBody extends Phaser.Scene {
    constructor() {
        super({key: 'GameBody'});
    }

    cursor = null;

    init() {
        this.gameOver = false;
        this.x = c_redline_left - 10;
        this.y = c_height / 2;
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('background', 'assets/bg1_darken.png');
        this.load.image('cat', 'assets/cat.png');
        this.load.image('st-good', 'assets/student_good1.png');
        this.load.image('st-bad', 'assets/student_bad1.png');
        this.load.image('magic', 'assets/magic.png');

        this.load.audio('bgm', 'assets/bgm/Alla-Turca.mp3');
        this.load.audio('meow', 'assets/bgm/meow.mp3');
        this.load.audio('biu', 'assets/bgm/biu.mp3');
    }

    create() {
        this.init();

        this.add.image(0,0,'background')
            .setDisplaySize(c_width, c_height)
            .setOrigin(0,0);

        this.bgm = this.sound.add('bgm', {loop: true});
        this.bgm.play();

        this.biu = this.sound.add('biu', {loop: false, volume: 0.25});

        this.player = this.physics.add.sprite(this.x, this.y, 'player').setOrigin(1,0.5);
        this.player.setDisplaySize(c_player_width, c_player_height);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(0);

        // The resource group for magic
        this.allMagic = this.physics.add.group();

        // The resource group for students
        this.allStudent = this.physics.add.group();

        // Use mouse movement to control the player
        this.input.on('pointermove', pointer => {
            this.player.y = pointer.y;
        });

        // Cannot use "('pointerdown', this.addBullet)" since the 'this' context is different
        this.input.on('pointerdown', () => this.addMagic());

        // The timer for adding students
        this.stuTimer = this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: () => {
                this.addStudent();
            }
        });
    }

    update() {
        // Check if bullets goes out of the screen
        this.allMagic.getChildren().forEach(magic => {
            if (magic.active && magic.x > c_width + c_magic_width) {
                // This will not remove the magic instance
                // Just set the bullet inactive and invisible
                // So it can be reused for next call
                this.allMagic.killAndHide(magic);
            }
        });
        this.allStudent.getChildren().forEach(student => {
            if (student.active && student.x < c_redline_left - c_student_width) {
                this.allStudent.killAndHide(student);
            }
        });
    }

    addMagic() {
        // the y-axis of the bullet. It goes right from the gun
        const magic_y = this.player.y + c_player_height*0.2695;

        const magic = this.allMagic.get(this.x, magic_y, 'magic');
        magic.setVelocity(c_magic_speed,0);
        magic.setSize(c_magic_width, c_magic_height);
        magic.setDisplaySize(c_magic_width, c_magic_height);

        // This might be a recollected magic, so re-activate it
        magic.setActive(true);
        magic.setVisible(true);

        // Sound effect
        this.biu.play();
    }

    addStudent() {
        const stu_y = Math.random() * (c_height - c_student_height);
        const stu_bad = (Math.random() < c_student_prob);
        const asset_name = stu_bad? 'st-bad': 'st-good';
        
        let student = this.allStudent.get(c_width, stu_y, asset_name);
        student.bad = stu_bad;
        student.setDisplaySize(c_student_width, c_student_height);
        student.setSize(c_student_width, c_student_height);
        student.setOrigin(0,0);

        student.setActive(true);
        student.setVisible(true);

        student.setVelocity(-c_student_speed,0);
    }
};

const config = {
    type: Phaser.AUTO,
    width: c_width,
    height: c_height,
    backgroundColor: BABYBLUE,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: [StartScreen, GameBody]
};

const game = new Phaser.Game(config);