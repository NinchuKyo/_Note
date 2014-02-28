//
//  DetailViewController.h
//  _Note
//
//  Created by Lyndon Quigley on 2/4/2014.
//  Copyright (c) 2014 Lyndon Quigley. All rights reserved.
//

#import <UIKit/UIKit.h>

@class Note;

@interface NoteEditorViewController : UIViewController <UISplitViewControllerDelegate>

@property (strong, nonatomic) IBOutlet UIWebView *web;
@property (strong, nonatomic) id detailItem;
@property (weak, nonatomic) IBOutlet UILabel *detailDescriptionLabel;

@property Note *note;

@end
